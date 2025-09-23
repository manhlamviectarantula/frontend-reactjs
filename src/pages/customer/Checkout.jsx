import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { formatDate } from '../../lib/utils';
import { toast } from 'react-toastify';
import HoldSeatsTimer from '../../components/HoldSeatsTimer';
import PaymentMethod from '../../components/PaymentMethod';

const Checkout = () => {
    const { selectedSeats, ShowtimeInfoOrder, ShowtimeInfoDisplay, orderFoods } = useSelector(state => state.order);

    const [showAgeWarning, setShowAgeWarning] = useState(false);

    const userinfo = useSelector((state) => state.user.currentUser);
    const userid = userinfo?.user.AccountID;

    const calculateTotalSeatPrice = () => {
        return selectedSeats.reduce((total, seat) => total + seat.TicketPrice, 0);
    };

    // Tính tổng giá trị của thức ăn
    const calculateTotalFoodPrice = () => {
        return orderFoods.reduce((total, food) => total + (food.Price * food.quantity), 0);
    };

    // Tính tổng đơn (ghế + thức ăn)
    const calculateTotalPrice = () => {
        const seatTotal = calculateTotalSeatPrice();
        const foodTotal = calculateTotalFoodPrice();
        return seatTotal + foodTotal;
    };

    const getShowtimeSeatIDData = () => {
        return {
            ShowtimeSeatIDs: selectedSeats.map(seat => seat.ShowtimeSeatID)
        };
    };

    const [email, setEmail] = useState('');
    const [emailOTPchecked, setEmailOTPchecked] = useState('')
    const [otp, setOTP] = useState('');
    const [showOTPModal, setShowOTPModal] = useState(false)
    const handleShowOTPModal = () => setShowOTPModal(true);
    const handleCloseOTPModal = () => setShowOTPModal(false);

    const handleSendCode = async () => {
        try {
            if (!email) {
                toast.error('Vui lòng điền email nhận vé!')
            }
            await axios.post(`${process.env.REACT_APP_API}/auth/request-otp/${email}`);
            handleShowOTPModal();
        } catch (error) {
            toast.error(error.response.data.error)
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/auth/verify-otp`,
                {
                    email: email,
                    code: otp
                });
            setEmailOTPchecked(res.data.email)
            toast.success('Xác thực email thành công!')
            handleCloseOTPModal();
        } catch (error) {
            toast.error(error.response.data.error)
        }
    };

    const handleCheckout = () => {
        setShowAgeWarning(true);
    };

    const proceedCheckout = async () => {
        const totalPrice = calculateTotalPrice();

        const fullOrderData = {
            order: {
                AccountID: userid || null,
                ShowtimeID: ShowtimeInfoOrder.ShowtimeID,
                Email: userid ? null : emailOTPchecked,
                Total: totalPrice,
                Point: totalPrice
            },
            orderFoods: orderFoods.map(f => ({
                FoodID: f.FoodID,
                Quantity: f.quantity,
                TotalPrice: f.TotalPrice
            })),
            showtimeSeatUpdates: getShowtimeSeatIDData()
        };

        const res = await axios.post(
            `${process.env.REACT_APP_API}/order/create-payment`,
            fullOrderData
        );

        const payUrl = res.data.payUrl;
        window.location.href = payUrl;
    };

    const [selectedMethod, setSelectedMethod] = useState('');

    return (
        <>
            <Header />
            <Container className="my-4">
                <>
                    <div style={{ margin: '30px auto 35px' }}>
                        <h4 className='text-center'>
                            <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
                                Xác nhận thanh toán
                            </span>
                        </h4>
                    </div>
                    <div style={{ border: '2px dashed black', padding: '20px' }}>
                        <div className='' style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                            <Row>
                                <Col md={3}>
                                    <Card.Img
                                        variant="top"
                                        src={`${process.env.REACT_APP_API}/${ShowtimeInfoDisplay?.Poster}`}
                                        className="w-100 rounded"
                                    />
                                </Col>
                                <Col md={5} className="d-flex flex-column">
                                    <div style={{ borderBottom: "1px solid black" }}>
                                        <h4>{ShowtimeInfoDisplay.MovieName}</h4>
                                        <p>Thời lượng: {ShowtimeInfoDisplay.Duration} phút</p>
                                    </div>
                                    <div className="my-3 pb-3" style={{ borderBottom: "1px solid black" }}>
                                        <div>{ShowtimeInfoDisplay.BranchName} - {ShowtimeInfoDisplay.TheaterName}</div>
                                        <div>Suất: {ShowtimeInfoDisplay.StartTime} - {formatDate(ShowtimeInfoDisplay.ShowDate)}</div>
                                        <div>Ghế: <strong>{selectedSeats.map(s => `${s.RowName}${s.SeatNumber}`).join(", ")}</strong></div>
                                        <div>
                                            Tổng cộng: <strong>{calculateTotalSeatPrice().toLocaleString()}đ</strong>
                                        </div>
                                    </div>
                                    <div className="pb-2" style={{ borderBottom: "1px solid black" }}>
                                        {orderFoods.map((food, index) => (
                                            <div key={index} style={{ marginBottom: '10px' }}>
                                                <div>
                                                    <strong>{food.FoodName}</strong> - <span><strong>{food.Price.toLocaleString()} x {food.quantity} = {food.TotalPrice.toLocaleString()}đ</strong></span>
                                                </div>
                                                {food.Description && <div><small>{food.Description}</small></div>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 pb-3 d-flex justify-content-between">
                                        <h6>Tổng đơn:</h6>
                                        <h6>{calculateTotalPrice().toLocaleString()}đ</h6>
                                    </div>
                                </Col>
                                <Col md={4} className="d-flex flex-column">
                                    <HoldSeatsTimer></HoldSeatsTimer>
                                    {(() => {
                                        if (userinfo === null) {
                                            if (!emailOTPchecked) {
                                                return (<>
                                                    <h6 style={{ marginBottom: "15px" }}>Email nhận vé:</h6>
                                                    <Form>
                                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="email"
                                                                    placeholder="Nhập email nhận hóa đơn từ CINÉMÀ"
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                />
                                                                <Button variant="dark" onClick={handleSendCode}>
                                                                    Gửi OTP
                                                                </Button>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </>)
                                            } else {
                                                return (<>
                                                    <div className='d-flex justify-content-between'>
                                                        <h6 style={{ marginBottom: "25px" }}>Email nhận vé: </h6>
                                                        <p>{emailOTPchecked}</p>
                                                    </div>

                                                    <PaymentMethod
                                                        selectedMethod={selectedMethod}
                                                        setSelectedMethod={setSelectedMethod}
                                                        handleCheckout={handleCheckout}
                                                    />
                                                </>)
                                            }
                                        } else {
                                            return (
                                                <PaymentMethod
                                                    selectedMethod={selectedMethod}
                                                    setSelectedMethod={setSelectedMethod}
                                                    handleCheckout={handleCheckout}
                                                />
                                            )
                                        }
                                    })()}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </>
                {/* )} */}
            </Container>
            <Footer />

            {/* Modal OTP */}
            <Modal show={showOTPModal} onHide={handleCloseOTPModal} centered>
                <Modal.Header closeButton>
                    <img
                        src={`${process.env.REACT_APP_API}/upload/cinema-logo-png_seeklogo-370721.png`}
                        alt="Cinema logo - homepage"
                        height="40"
                    />
                    <Modal.Title className='ms-3'>Xác thực OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body closeButton className='text-center'>
                    <Form onSubmit={handleVerifyOTP}>
                        <Form.Group className="mb-3 text-center" controlId="formBasicEmail">
                            <Form.Control type="text" onChange={(e) => setOTP(e.target.value)} placeholder="Nhập mã OTP..." />
                            <Form.Text className="text-muted">
                                Nếu chưa nhận được mã OTP, vui lòng kiểm tra lại địa chỉ gmail bạn đã cung cấp
                            </Form.Text>
                        </Form.Group>

                        <Button variant="dark" type="submit">
                            Xác nhận
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showAgeWarning} onHide={() => setShowAgeWarning(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cảnh báo độ tuổi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Hãy chắc chắn bạn đang ở độ tuổi phù hợp để xem phim trước khi thanh toán.
                        Hệ thống sẽ không chịu trách nhiệm trong trường hợp bạn không đủ tuổi để vào rạp xem phim.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowAgeWarning(false)}>
                        Hủy
                    </Button>
                    <Button variant="success" onClick={() => {
                        setShowAgeWarning(false);
                        proceedCheckout(); // Gọi thanh toán nếu người dùng đồng ý
                    }}>
                        Tôi đồng ý
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default Checkout;
