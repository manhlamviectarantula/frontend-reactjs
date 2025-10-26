import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import './App.css';
import Home from './pages/customer/Home';
import Showing from './pages/customer/Showing';
import Coming from './pages/customer/Coming';
import DetailsMovie from './pages/customer/DetailsMovie';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAccount from './pages/admin/ManageAccount';
import ManageBranch from './pages/admin/ManageBranch';
import RolePermission from './pages/admin/RolePermission';
import BranchAdminDashboard from './pages/branchAdmin/BranchAdminDashboard';
import ManageTheater from './pages/branchAdmin/ManageTheater';
import ManageShowtime from './pages/branchAdmin/ManageShowtime';
import ManageFood from './pages/branchAdmin/ManageFood';
import SelectShowtime from './pages/customer/SelectShowtime';
import SelectSeat from './pages/customer/SelectSeat';
import Account from './pages/customer/Account';
import Checkout from './pages/customer/Checkout';
import SelectFood from './pages/customer/SelectFood';
import History from './pages/customer/History';
import ManageMovie from './pages/admin/ManageMovie';
import ChatBox from './pages/customer/ChatBox';
import ChatCSKH from './pages/admin/ChatCSKH';
import MomoResult from './pages/customer/MomoResult';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginSuccess } from './redux/userRedux';
import HoldSeats from './components/HoldSeats';
import ChatBot from './pages/customer/ChatBot';
import Actor from './pages/customer/Actor';
import Director from './pages/customer/Director';
import BranchAdminInfo from './pages/branchAdmin/BranchAdminInfo';
import OAuthCallback from './components/OAuthCallback';


function App() {

  // const isBranchAdmin = store.getState().user.currentUser?.user;
  // const isAdmin = store.getState().user.currentUser?.user;
  // const user = store.getState().user.currentUser?.user;
  const user = useSelector((state) => state.user.currentUser?.user);
  const location = useLocation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!user?.AccountID) return;

  //   connectSocket(user.AccountID, dispatch);

  //   // return () => {
  //   //   disconnectSocket()
  //   // };
  // }, [user?.AccountID]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const accountID = params.get('accountID');
    const accountTypeID = params.get('accountTypeID');
    const email = params.get('email');
    const fullName = params.get('fullName');
    const fromFacebook = params.get('fromFacebook')

    if (token && accountID && accountTypeID && email && fullName) {
      dispatch(loginSuccess({
        token,
        user: {
          AccountID: Number(accountID),
          AccountTypeID: Number(accountTypeID),
          Email: email,
          FullName: fullName,
          FromFacebook: fromFacebook,
        },
      }));
    }
  }, [location.search]);

  return (
    <>
      <HoldSeats />
      {user?.AccountTypeID === 1 ? <ChatBot/> : <></>}
      <Routes>
        <>
          <Route path="/" element={<Home />} />
          <Route path="/showing" element={<Showing />} />
          <Route path="/coming" element={<Coming />} />
          <Route path="/detailsMovie/:id" element={<DetailsMovie />} />
          <Route
            path="/account"
            element={user ? <Account /> : <Navigate to="/" replace />}
          />
          <Route path="/history/:AccountID" element={<History />} ></Route>
          <Route path="/selectFood/:BranchID" element={<SelectFood />} ></Route>
          <Route path="/selectShowtime/:MovieID" element={<SelectShowtime />} ></Route>

          <Route path="/selectSeat/:ShowtimeID" element={<SelectSeat />} ></Route>
          <Route path="/checkout" element={<Checkout />} ></Route>
          <Route path="/chat" element={<ChatBox />} />
          <Route path="/actor" element={<Actor />} />
          <Route path="/director" element={<Director />} />

          <Route path="/momo/result" element={<MomoResult />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

        </>

        {
          user?.AccountTypeID === 2 && (
            <>
              <Route path='/branch-ad-dashboard' element={<BranchAdminDashboard />}></Route>
              <Route path='/branch-ad-info' element={<BranchAdminInfo />}></Route>
              <Route path='/manageTheater' element={<ManageTheater />}></Route>
              <Route path='/manageShowtime' element={<ManageShowtime />}></Route>
              <Route path='/manageFood' element={<ManageFood />}></Route>
            </>
          )
        }

        {
          user?.AccountTypeID === 3 && (
            <>
              <Route path='/ad-dashboard' element={<AdminDashboard />}></Route>
              <Route path='/manageAccount' element={<ManageAccount />}></Route>
              <Route path='/manageBranch' element={<ManageBranch />}></Route>
              <Route path='/manageMovie' element={<ManageMovie />}></Route>
              <Route path='/rolePermission' element={<RolePermission />}></Route>
              <Route path='/chatCSKH' element={<ChatCSKH />}></Route>
            </>
          )
        }

      </Routes>
    </>
  );
}

export default App;