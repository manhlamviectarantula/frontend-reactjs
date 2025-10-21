import { useState } from 'react';
import { Button, Container, Form, Modal, Nav, Navbar } from 'react-bootstrap';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/apiCalls';
import { store } from '../redux/store';
import { toast, ToastContainer } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";

const CustomNavbar = styled(Navbar)`
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CustomNavLink = styled(Nav.Link)`
    font-size: 18px; 
    font-weight: 500; 
    color: gray;
    text-decoration: none;
    margin-left: 40px;

    &:hover, &:active {
        color: black;
        text-decoration: overline;
    }

    &.active {
        color: black;
        text-decoration: overline;
    }
`;

const Header = () => {
    const user = store.getState().user.currentUser?.user;

    const [showLogin, setShowLogin] = useState(false);
    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);
    const { isFetching, mesError } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ====== Quên mật khẩu ======
    const [showForget, setShowForget] = useState(false);
    const [forgetEmail, setForgetEmail] = useState('');

    const handleCloseForget = () => setShowForget(false);

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        if (!forgetEmail) {
            toast.error("Vui lòng nhập email!");
            return;
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/account/forget-pw`, {
                email: forgetEmail,
            });
            toast.success(res.data.message || "Mật khẩu mới đã được gửi tới email!");
            handleCloseForget();
        } catch (err) {
            toast.error(err.response?.data?.error || "Gửi yêu cầu thất bại, vui lòng thử lại.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            await login(dispatch, { email, password }, navigate);
            handleCloseLogin();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleLoginFB = async (e) => {
        e.preventDefault();
        window.location.href = `${process.env.REACT_APP_API}/auth/facebook/login`;
    };

    const handleLoginGoogle = async (e) => {
        e.preventDefault();
        window.location.href = `${process.env.REACT_APP_API}/auth/google/login`;
    };

    // Xử lý đăng ký
    const [showRegister, setShowRegister] = useState(false);
    const handleShowRegister = () => setShowRegister(true);
    const handleCloseRegister = () => setShowRegister(false);
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value,
        });
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        const { fullName, email, phoneNumber, password, confirmPassword, birthDate } = registerData;

        if (!email || !password || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Nhập lại mật khẩu chưa đúng!");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API}/auth/register`, {
                fullName,
                email,
                phoneNumber,
                password,
                birthDate,
            });

            toast.success("Đăng ký thành công, vui lòng đăng nhập");
            handleCloseRegister();
        } catch (err) {
            toast.error(err.response?.data.error || 'Đăng ký thất bại, vui lòng thử lại.');
        }
    };

    return (
        <>
            <CustomNavbar data-bs-theme="light">
                <Container>
                    <CustomNavbar.Brand as={NavLink} to="/">
                        <img
                            src={`https://res.cloudinary.com/dnpo0jukc/image/upload/v1759719075/Designer-Photoroom_rrk4es.png`}
                            alt="Cinema logo - homepage"
                            height="40"
                        />
                    </CustomNavbar.Brand>
                    <Nav className="ms-auto">
                        <CustomNavLink as={NavLink} to="/">Trang chủ</CustomNavLink>
                        <CustomNavLink as={NavLink} to="/showing">Phim đang chiếu</CustomNavLink>
                        <CustomNavLink as={NavLink} to="/coming">Phim sắp chiếu</CustomNavLink>
                        {user ? (
                            <CustomNavLink as={NavLink} to="/account">Tài khoản</CustomNavLink>
                        ) : (
                            <CustomNavLink as="span" onClick={handleShowLogin} style={{ cursor: 'pointer' }}>
                                Đăng nhập
                            </CustomNavLink>
                        )}
                    </Nav>
                </Container>
            </CustomNavbar>

            {/* Modal Đăng Nhập */}
            <Modal show={showLogin} onHide={handleCloseLogin} centered>
                <Modal.Header closeButton>
                    <img
                        src={`https://res.cloudinary.com/dnpo0jukc/image/upload/v1759719075/Designer-Photoroom_rrk4es.png`}
                        alt="Cinema logo - homepage"
                        height="40"
                    />
                    <Modal.Title className='ms-3'>Đăng Nhập Tài Khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Nhập email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Nhập mật khẩu" />
                        </Form.Group>

                        <Button variant="dark" disabled={isFetching} onClick={handleLogin} type="submit" className="w-100 mb-2 d-flex justify-content-center align-items-center">
                            {/* {isFetching ? <CircularProgress color="inherit" size={24} /> : 'Đăng nhập'} */}
                            Đăng nhập
                        </Button>

                        <div className='d-flex justify-content-center align-items-center gap-2'>
                            <span>hoặc đăng nhập với:</span>
                            {/* <Button variant="primary" disabled={isFetching} onClick={handleLoginFB} className="d-flex justify-content-center align-items-center px-2">
                                <FacebookIcon fontSize="small" />
                            </Button>
                            <Button variant="outline-danger" disabled={isFetching} onClick={handleLoginGoogle} className="d-flex justify-content-center align-items-center px-2">
                                <GoogleIcon fontSize="small" />
                            </Button> */}
                            <Button variant="primary" onClick={handleLoginFB} className="d-flex justify-content-center align-items-center px-2">
                                <FacebookIcon fontSize="small" />
                            </Button>
                            <Button variant="outline-danger" onClick={handleLoginGoogle} className="d-flex justify-content-center align-items-center px-2">
                                <GoogleIcon fontSize="small" />
                            </Button>
                        </div>
                    </Form>

                    <p className="mt-2">
                        <span
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setShowLogin(false);
                                setShowForget(true);
                            }}
                        >
                            Quên mật khẩu?
                        </span>
                    </p>

                    <div className="d-flex">
                        Chưa có tài khoản?
                        <Nav.Link onClick={() => { handleShowRegister(); handleCloseLogin(); }} style={{ color: '#eb5ca2' }}>
                            &nbsp; Đăng ký ngay.
                        </Nav.Link>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal Quên mật khẩu */}
            <Modal show={showForget} onHide={handleCloseForget} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Quên mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleForgetPassword}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nhập email đã đăng ký</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email..."
                                value={forgetEmail}
                                onChange={(e) => setForgetEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit" variant="dark" className="w-100">
                            Gửi yêu cầu
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Đăng Ký */}
            <Modal show={showRegister} onHide={handleCloseRegister} centered>
                <Modal.Header closeButton>
                    <img
                        src={`https://res.cloudinary.com/dnpo0jukc/image/upload/v1759719075/Designer-Photoroom_rrk4es.png`}
                        alt="Cinema logo - homepage"
                        height="40"
                    />
                    <Modal.Title className='ms-3'>Đăng Ký Tài Khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control onChange={handleChange} name="email" type="email" placeholder="Nhập email..." />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control onChange={handleChange} name="password" type="password" placeholder="Nhập mật khẩu..." />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nhập lại mật khẩu</Form.Label>
                            <Form.Control onChange={handleChange} name="confirmPassword" type="password" placeholder="Nhập lại mật khẩu..." />
                        </Form.Group>
                        <Button type="submit" style={{ border: 'none', background: '#212529' }} className="mb-4 w-100 py-2 mt-2" size="sm">
                            Đăng ký
                        </Button>
                    </Form>
                    <p className="mx-auto d-flex">
                        Đã có tài khoản?
                        <Nav.Link onClick={() => { handleShowLogin(); handleCloseRegister(); }} style={{ color: '#eb5ca2' }}>
                            &nbsp; Đăng nhập ngay.
                        </Nav.Link>
                    </p>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default Header;
