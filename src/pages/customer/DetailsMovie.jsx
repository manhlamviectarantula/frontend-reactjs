import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDate } from '../../lib/utils';

const DetailsMovie = () => {
    const [movie, setMovie] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const id = location.pathname.split("/")[2];

    useEffect(() => {
        const getMovie = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/movie/details-movie/${id}`);
                setMovie(res.data.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        getMovie();
    }, [id]);

    const handleOrderTicket = (movie) => {
        navigate(`/selectShowtime/${movie.MovieID}`, {
            state: { MovieName: movie.MovieName, Poster: movie.Poster }
        });
    };

    return (
        <>
            <Header />
            <Container className="my-4">
                <div style={{ margin: '30px auto 35px' }}>
                    <h4 className='text-center'>
                        <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
                            THÔNG TIN PHIM
                        </span>
                    </h4>
                </div>
                <Row>
                    <Col md={3}>
                        <Card.Img
                            variant="top"
                            src={`${process.env.REACT_APP_API}/${movie.Poster}`}
                            alt={movie.MovieName}
                            className="w-100 rounded"
                        />
                    </Col>

                    <Col md={9} >
                        <div className='d-flex justify-content-between align-items-center'>
                            <h2 className="mb-2">{movie.MovieName}</h2>
                            <Badge bg="danger" className="mb-2">
                                {movie.AgeTag}
                            </Badge>
                        </div>
                        <div className='infoWrap mb-3'>
                            <div><strong>Thời lượng:</strong> {movie.Duration} phút</div>
                            <div><strong>Ngày khởi chiếu:</strong> {formatDate(movie.ReleaseDate)}</div>
                            <div><strong>Nội dung phim:</strong> {movie.Description}</div>
                        </div>
                        <Button
                            variant='dark'
                            onClick={() => handleOrderTicket(movie)}
                            className="w-100 mt-2"
                        >
                            ĐẶT VÉ
                        </Button>
                    </Col>
                </Row>

                <div style={{ margin: '35px auto 25px' }}>
                    <h4 className='text-center'>
                        <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
                            TRAILER
                        </span>
                    </h4>
                </div>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <div className="ratio ratio-16x9">
                            <iframe
                                src={movie.Trailer}
                                title="YouTube trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: '8px', border: 'none' }}
                            ></iframe>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </>
    );
};

export default DetailsMovie;
