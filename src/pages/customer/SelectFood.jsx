import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addOrderFoods, decreaseOrderFood } from '../../redux/orderRedux';
import { formatDate } from '../../lib/utils';
import HoldSeatsTimer from '../../components/HoldSeatsTimer';

const SelectFood = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { selectedSeats, ShowtimeInfoDisplay, orderFoods } = useSelector(state => state.order);

    const [foodData, setFoodData] = useState([])

    useEffect(() => {
        const getFoods = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/food/get-foods-of-branch/${ShowtimeInfoDisplay.BranchID}`);
                setFoodData(res.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        getFoods();
    }, [ShowtimeInfoDisplay.BranchID]);

    const calculateTotalTicketPrice = () => {
        return selectedSeats.reduce((total, seat) => total + seat.TicketPrice, 0);
    };

    const calculateTotalFoodPrice = () => {
        return orderFoods.reduce((total, food) => total + food.Price * food.quantity, 0);
    };

    const calculateTotalOrderPrice = () => {
        return calculateTotalTicketPrice() + calculateTotalFoodPrice();
    };

    const handleIncrease = (food) => {
        dispatch(addOrderFoods(food));
    };

    const handleDecrease = (food) => {
        dispatch(decreaseOrderFood(food))
    };

    const handleContinue = () => {
        navigate('/checkout');
    }

    return (
        <>
            <Header />
            <Container className="my-4">
                <div style={{ margin: '30px auto 35px' }}>
                    <h4 className="text-center">
                        <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
                            Chọn thức ăn
                        </span>
                    </h4>
                </div>
                <div style={{ border: '2px dashed black', padding: '20px' }}>
                    <div className='' style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                        <Row className="mb-3">
                            <Col md={8}>
                                {foodData.map((food, index) => (
                                    <Row key={food.FoodID} className="mb-3">
                                        <Col md={4}>
                                            <img src={`${process.env.REACT_APP_API}/${food.Image}`}
                                                alt='ok' style={{ width: '100%', marginBottom: "10px" }} />
                                        </Col>
                                        <Col md={5}>
                                            <h5>{food.FoodName}</h5>
                                            <p>{food.Description}</p>
                                            <p><strong>Giá: {food.Price.toLocaleString()}đ</strong></p>
                                        </Col>
                                        <Col md={2} className="d-flex align-items-center">
                                            <Button variant="outline-secondary" onClick={() => handleDecrease(food)}>-</Button>
                                            <span className="mx-3">
                                                {orderFoods.find(item => item.FoodID === food.FoodID)?.quantity || 0}
                                            </span>
                                            <Button variant="outline-secondary" onClick={() => handleIncrease(food)}>+</Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>
                            <Col md={4} className="d-flex flex-column py-2" style={{ border: "1px dashed black" }}>
                                <HoldSeatsTimer></HoldSeatsTimer>
                                <div className='d-flex gap-3 py-3' style={{ borderBottom: "1px solid black" }}>
                                    <Card.Img
                                        variant="top"
                                        src={`${process.env.REACT_APP_API}/${ShowtimeInfoDisplay?.Poster}`}
                                        style={{ width: "30%" }}
                                    />
                                    <div>
                                        <h4>{ShowtimeInfoDisplay.MovieName}</h4>
                                        <p>Thời lượng: {ShowtimeInfoDisplay.Duration} phút</p>
                                    </div>
                                </div>
                                <div className="my-3 pb-3" style={{ borderBottom: "1px solid black" }}>
                                    <div>{ShowtimeInfoDisplay.BranchName} - {ShowtimeInfoDisplay.TheaterName}</div>
                                    <div>Suất: {ShowtimeInfoDisplay.StartTime} - {formatDate(ShowtimeInfoDisplay.ShowDate)}</div>
                                    <div>Ghế: <strong>{selectedSeats.map(s => `${s.RowName}${s.SeatNumber}`).join(", ")}</strong></div>
                                    <div>Tổng giá vé: <strong>{calculateTotalTicketPrice().toLocaleString()}đ</strong></div>
                                </div>
                                <div className="mb-3 pb-3" style={{ borderBottom: "1px solid black" }}>
                                    {
                                        orderFoods.map((food) => (
                                            <div key={food.FoodID} className='d-flex justify-content-between'>
                                                <div>{food.FoodName}</div>
                                                <div>
                                                    {(food.Price || 0).toLocaleString()} x {food.quantity || 0} ={" "}
                                                    {(food.TotalPrice || 0).toLocaleString()}đ
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div className='d-flex justify-content-between'>
                                        <div>Tổng giá thức ăn:</div>
                                        <div><strong>{calculateTotalFoodPrice().toLocaleString()}đ</strong></div>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <strong>Tổng đơn hàng:</strong>
                                    <strong>{calculateTotalOrderPrice().toLocaleString()}đ</strong>
                                </div>
                                <Button
                                    variant="dark"
                                    className='w-100 mt-2'
                                    onClick={() => handleContinue()}
                                >
                                    Tiếp tục
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default SelectFood;
