import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUserAPI } from '../../redux/apiCalls';
import axios from 'axios';
import { toast } from 'react-toastify';

const Account = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.currentUser)
    const userinfo = useSelector((state) => state.user.currentUser.user)

    const id = userinfo.AccountID
    const token = user.token

    const [FullName, setFullName] = useState(userinfo.FullName);
    const [Email, setEmail] = useState(userinfo.Email);
    const [PhoneNumber, setPhone] = useState(userinfo.PhoneNumber);
    const [BirthDate, setBirthDate] = useState(userinfo.BirthDate)
    const [Point] = useState(userinfo.Point || 0)

    const handleUpdate = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;

        if (!emailRegex.test(Email)) {
            toast.error("Email không hợp lệ.");
            return;
        }

        if (!phoneRegex.test(PhoneNumber)) {
            toast.error("Số điện thoại không hợp lệ.");
            return;
        }

        await updateUserAPI(dispatch, id, {
            FullName,
            Email,
            PhoneNumber,
            BirthDate
        }, token);
    };

    const handleLogout = () => {
        logout(dispatch);
        navigate('/')
        window.scrollTo(0, 0);
    }

    const toHistory = () => {
        navigate(`/history/${id}`)
        window.scrollTo(0, 0);
    }

    const toChatCSKH = () => {
        navigate(`/chat`)
        window.scrollTo(0, 0);
    }

    // Sửa mật khẩu 
    const [showChangePassword, setShowChangePassword] = useState(false);
    const handleShowChangePassword = () => setShowChangePassword(true);
    const handleCloseChangePassword = () => setShowChangePassword(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [cNewPassword, setCNewPassword] = useState('');

    const UpdatePW = (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !cNewPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (newPassword !== cNewPassword) {
            toast.error("Nhập lại mật khẩu mới chưa đúng!")
            return;
        }

        axios
            .put(`${process.env.REACT_APP_API}/account/update-pw/${id}`, {
                currentPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                toast.success("Đổi mật khẩu thành công!")
                handleCloseChangePassword()
                setCurrentPassword('')
                setNewPassword('')
                setCNewPassword('')
            })
            .catch((err) => {
                toast.error(err.response.data.error)
            });
    };

    return (
        <>
            <Header />
            <Container style={{ margin: '30px auto', border: '1.5px solid #212121', borderRadius: '4px' }}>
                <Row style={{ alignItems: 'center' }}>
                    <Col sm={6}>
                        <div className='d-flex flex-column justify-content-center h-custom-2 w-100 ps-5 pe-5 pt-4'>
                            <h2 className="fw-bold mb-2 pb-3 mx-auto" style={{ letterSpacing: '1px' }}>Thông tin tài khoản</h2>
                            <Form onSubmit={handleUpdate}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Họ tên</Form.Label>
                                    <Form.Control onChange={(e) => setFullName(e.target.value)} type="text" value={FullName} />

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control onChange={(e) => setEmail(e.target.value)} type="text" value={Email} />

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control onChange={(e) => setPhone(e.target.value)} type="text" value={PhoneNumber} />

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Ngày sinh</Form.Label>
                                    <Form.Control onChange={(e) => setBirthDate(e.target.value)} type="date" value={BirthDate} />
                                </Form.Group>
                                <Button
                                    type='submit'
                                    style={{ border: 'none', background: '#212529' }}
                                    className='mb-4 w-100 py-2 mt-2'
                                    size="sm">
                                    Lưu thay đổi
                                </Button>
                            </Form>
                            <Button
                                onClick={handleLogout}
                                variant="danger"
                                style={{ border: 'none' }}
                                className='mb-3 w-100 py-2 mt-3'
                                size="sm">
                                Đăng xuất
                            </Button>
                            {
                                userinfo.FromFacebook === false ?
                                    <Button onClick={handleShowChangePassword}
                                        variant='secondary'
                                        style={{ border: "none" }}
                                        className="mb-3 w-100 py-2 mt-1"
                                        size="sm"
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                    :
                                    <></>
                            }

                            <Button
                                onClick={toHistory}
                                variant='secondary'
                                style={{ border: "none" }}
                                className="mb-3 w-100 py-2 mt-1"
                                size="sm"
                            >
                                Lịch sử giao dịch
                            </Button>
                            <Button
                                onClick={toChatCSKH}
                                variant='secondary'
                                style={{ border: "none" }}
                                className="mb-3 w-100 py-2 mt-1"
                                size="sm"
                            >
                                Chat với nhân viên CSKH
                            </Button>
                                <div>Điểm thành viên: {Point}</div>
                        </div>
                    </Col>
                    <Col sm={6} className='d-none d-sm-block px-0'>
                        <img
                            src={`https://res.cloudinary.com/dnpo0jukc/image/upload/v1758733088/474b71005977384e9080deeb9d23cb5c_wz63hb.jpg`}
                            alt="Login" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left', borderRadius: '4px' }}
                        />
                    </Col>
                </Row>
            </Container>

            <Modal show={showChangePassword} onHide={handleCloseChangePassword} centered>
                <Modal.Header closeButton>
                    <img
                        src={`https://res.cloudinary.com/dnpo0jukc/image/upload/v1759719075/Designer-Photoroom_rrk4es.png`}
                        alt="Cinema logo - homepage"
                        height="40"
                    />
                    <Modal.Title className='ms-3'>Đổi Mật Khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body closeButton>
                    <Form onSubmit={UpdatePW}>
                        <Form.Group className="mb-3" controlId="oldPassword">
                            <Form.Label>Mật khẩu hiện tại</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="confirmNewPassword">
                            <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                value={cNewPassword}
                                onChange={(e) => setCNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            type='submit'
                            style={{ border: 'none', background: '#212529' }}
                            className="w-100 py-2 mt-2"
                            size="sm"
                        >
                            Lưu thay đổi
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Footer />
        </>
    )
}

export default Account
