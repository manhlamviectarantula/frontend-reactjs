import axios from "axios"
import { loginFailure, loginStart, loginSuccess, logoutSucess, updateUser } from "./userRedux"
import { toast } from "react-toastify"
import { getMessage, getUserSidebarAdmin, sendMessage } from "./messageRedux"
import qs from 'qs';
import { connectSocket, disconnectSocket } from "../lib/socket";

export const getUserInfoFromToken = async (token, dispatch) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API}/user/info`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.data?.user) {
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
            return res.data.user;
        }

        return null;
    } catch (err) {
        return null;
    }
};

// export const logout = async (dispatch) => {
//     try {
//         // const res = await axios.post('http://localhost:8000/api/v0/auth/logout-user')
//         dispatch(logoutSucess())
//         disconnectSocket()
//     } catch (err) {
//         console.log(err)
//     }
// }

// apiCalls.jsx

export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${process.env.REACT_APP_API}/auth/login`, user);

        const { user: userData } = res.data || {};
        if (!userData?.AccountID) throw new Error("Invalid login response: missing AccountID");

        if (userData?.AccountTypeID === 3) navigate('/ad-dashboard');
        else if (userData?.AccountTypeID === 2) navigate('/branch-ad-dashboard');
        else navigate('/');

        dispatch(loginSuccess(res.data));
        await connectSocket(userData.AccountID, dispatch);  

        return userData;
    } catch (err) {
        const ErrMes = err?.response?.data?.error || err?.message || "Something went wrong";
        dispatch(loginFailure(ErrMes));
        throw new Error(ErrMes);
    }
};

export const checkAuth = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API}/auth/check`)

        return res.data
    } catch (err) {
        const ErrMes = err?.response?.data?.error || err?.message || "Something went wrong";
        console.error("❌ Login error:", ErrMes);
    }
}

export const logout = async (dispatch) => {
    try {
        await disconnectSocket();   // CHỜ disconnect xong hẳn
        dispatch(logoutSucess());
    } catch (err) {
        console.error("❌ Logout error:", err);
    }
};

export const updateUserAPI = async (dispatch, id, user, token) => {
    try {
        await axios.put(
            `${process.env.REACT_APP_API}/account/update-account/` + id,
            user,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        dispatch(updateUser(user));
        toast.success('Sửa thông tin thành công')
    } catch (err) {
        toast.error(err.response?.data?.error || "Lỗi không xác định");
    }
};

// getUsersSidebarAdmin làm sau
export const getUsersSidebarAdmin = async (dispatch, token) => {
    try {
        const users = await axios.get(
            // `${process.env.REACT_APP_API}/message/get-users-sidebar-admin`,
            `${process.env.REACT_APP_SOCKET_API}/api/v1/message/get-users-sidebar-admin/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        // console.log(users)
        dispatch(getUserSidebarAdmin(users.data))
    } catch (err) {
    }
}

export const getMessageAPI = async (dispatch, userToChatID, token) => {
    try {
        const mes = await axios.get(
            // `${process.env.REACT_APP_API}/message/get-message/` + userToChatID,
            `${process.env.REACT_APP_SOCKET_API}/api/v1/message/get-message/` + userToChatID,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // console.log(mes)
        dispatch(getMessage(mes.data));
        return mes.data
    } catch (err) {
        toast.error(err.response?.data?.error || "Lỗi không xác định");
    }
}

export const sendMessageAPI = async (dispatch, userToChatID, token, text) => {
    try {
        const res = await axios.post(
            // `${process.env.REACT_APP_API}/message/send-message/` + userToChatID,
            `${process.env.REACT_APP_SOCKET_API}/api/v1/message/send-message/` + userToChatID,
            qs.stringify({ Text: text }),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }
        );

        console.log(res)

        dispatch(sendMessage(res.data));
    } catch (err) {
        toast.error(err.response?.data?.error || "Lỗi không xác định");
    }
};