import { useState } from 'react';
import { Col, Container, Row, Card, Offcanvas } from 'react-bootstrap';
import { Business, Movie, Stadium, Slideshow, Living, LocalActivity, ReceiptLong } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';
import Slider from "react-slick";
import { sliderSettings } from '../../components/CustomArrowSlide';
import RevenueAndAgeChart from '../../components/RevenueAndAgeChart';
import "react-datepicker/dist/react-datepicker.css";
import MoviesDrawer from './AdminDrawer.jsx/MoviesDrawer';
import BranchesDrawer from './AdminDrawer.jsx/BranchesDrawer';
import { toast, ToastContainer } from 'react-toastify';

const AdminDashboard = () => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedCardKey, setSelectedCardKey] = useState(null);

    const [drawerStatic, setDrawerStatic] = useState()

    const handleCardClick = async (key) => {
        setSelectedCardKey(key);

        switch (key) {
            case "movies":
                setDrawerStatic(<MoviesDrawer />);
                setShowDrawer(true);
                break;

            case "branches":
                setDrawerStatic(<BranchesDrawer />);
                setShowDrawer(true);
                break;

            case "receipts":
            case "theaters":
            case "showtimes":
            case "seats":
            case "vouchers":
                toast.warning("Tính năng đang được phát triển!");
                setShowDrawer(false);
                break;

            default:
                setShowDrawer(false);
                break;
        }
    };
    const cardMap = {
        movies: { title: 'Doanh thu phim', color: '#673AB7', icon: <Movie fontSize="large" /> },
        branches: { title: 'Doanh thu chi nhánh', color: '#2196F3', icon: <Business fontSize="large" /> },
        receipts: { title: 'Thống kê hóa đơn', color: '#72b371', icon: <ReceiptLong fontSize="large" /> },
        theaters: { title: 'Thống kê rạp phim', color: '#FF5722', icon: <Stadium fontSize="large" /> },
        showtimes: { title: 'Thống kê suất chiếu', color: '#0dcaf0', icon: <Slideshow fontSize="large" /> },
        seats: { title: 'Thống kê ghế', color: '#009688', icon: <Living fontSize="large" /> },
        vouchers: { title: 'Thống kê voucher', color: '#4CAF50', icon: <LocalActivity fontSize="large" /> },
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1, background: '#fff' }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarAdmin} />
                    <Col md={10} className="p-4 position-relative">
                        <Row className="rounded-1 shadow mb-4" style={{ background: '#f0f0f0' }}>
                            <Col className="p-2">
                                <Slider {...sliderSettings}>
                                    {Object.entries(cardMap).map(([key, { title, color, icon }]) => (
                                        <div key={key}>
                                            <Card
                                                className="mx-2 stat-card"
                                                onClick={() => handleCardClick(key)}
                                                style={{
                                                    borderRadius: '12px',
                                                    textAlign: 'center',
                                                    backgroundColor: color,
                                                    color: 'white'
                                                }}>
                                                <Card.Body>
                                                    <div className="d-flex justify-content-center mb-2">{icon}</div>
                                                    <h6 className="mb-2">{title}</h6>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))}
                                </Slider>
                            </Col>
                        </Row>

                        <RevenueAndAgeChart />
                    </Col>
                </Row>

                <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} placement="end" style={{ width: '900px' }}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            {selectedCardKey ? cardMap[selectedCardKey].title : 'Chi tiết'}
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {drawerStatic}
                    </Offcanvas.Body>
                </Offcanvas>
            </Container>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default AdminDashboard;
