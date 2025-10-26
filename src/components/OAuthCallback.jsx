import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/userRedux';

const OAuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get('token');
        const accountID = query.get('accountID');
        const accountTypeID = query.get('accountTypeID');
        const email = query.get('email');
        const fullName = query.get('fullName');
        const fromFacebook = query.get('fromFacebook') === 'true';
        const point = Number(query.get('point')) || 0;

        if (token) {
            dispatch(loginSuccess({
                token,
                user: {
                    AccountID: Number(accountID),
                    AccountTypeID: Number(accountTypeID),
                    Email: email,
                    FullName: fullName,
                    FromFacebook: fromFacebook,
                    Point: point
                }
            }));
            navigate('/'); // redirect về home
        }
    }, [dispatch, navigate]);

    return <div>Đang xử lý đăng nhập...</div>;
};

export default OAuthCallback;
