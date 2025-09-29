import { useState } from 'react';
import { Col, Container, Row, Card, Offcanvas } from 'react-bootstrap';
import { Business, Movie, Stadium, Slideshow, LocalActivity, ReceiptLong, Fastfood } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import SidebarBranchAdmin from './sidebarBranchAdmin';
import Slider from "react-slick";
import { sliderSettings } from '../../components/CustomArrowSlide';
import RevenueAndAgeChart from '../../components/RevenueAndAgeChart';
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import BranchesDrawer from '../admin/AdminDrawer.jsx/BranchesDrawer';
import FoodDrawer from './BranchAdminDrawer/FoodsDrawer';
import { store } from '../../redux/store';

const BranchAdminDashboard = () => {
    const BranchName = store.getState().user.currentUser.user.BranchName
    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedCardKey, setSelectedCardKey] = useState(null);

    const [drawerStatic, setDrawerStatic] = useState()

    const handleCardClick = async (key) => {
        setSelectedCardKey(key);

        switch (key) {
            case "movies":
                setDrawerStatic(<BranchesDrawer />);
                setShowDrawer(true);
                break;

            case "foods":
                setDrawerStatic(<FoodDrawer />);
                setShowDrawer(true);
                break;

            case "branches":
            case "receipts":
            case "theaters":
            case "showtimes":
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
        foods: { title: 'Doanh thu thức ăn', color: '#009688', icon: <Fastfood fontSize="large" /> },
        branches: { title: 'Thống kê chi nhánh', color: '#2196F3', icon: <Business fontSize="large" /> },
        receipts: { title: 'Thống kê hóa đơn', color: '#72b371', icon: <ReceiptLong fontSize="large" /> },
        theaters: { title: 'Thống kê rạp phim', color: '#FF5722', icon: <Stadium fontSize="large" /> },
        showtimes: { title: 'Thống kê suất chiếu', color: '#0dcaf0', icon: <Slideshow fontSize="large" /> },
        vouchers: { title: 'Thống kê voucher', color: '#4CAF50', icon: <LocalActivity fontSize="large" /> },
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1, background: '#fff' }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarBranchAdmin} />
                    <Col md={10} className="p-4 position-relative">
                        <div className='text-center mb-3'>
                            <h3>Chi nhánh {BranchName}</h3>
                        </div>
                        <Slider className='rounded-1 shadow mb-4 p-2' style={{ background: '#f0f0f0' }} {...sliderSettings}>
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

export default BranchAdminDashboard;
