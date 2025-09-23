import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Showing = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/movie/get-showing-movie`);
        setMovies(response.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phim:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleCardClick = (MovieID) => {
    navigate(`/detailsMovie/${MovieID}`);
  };

  return (
    <>
      <Header />
      <Container className="mt-4 mb-4">
        <div style={{ margin: '30px auto 35px' }}>
          <h4 className='text-center'>
            <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
              PHIM ĐANG CHIẾU
            </span>
          </h4>
        </div>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {movies.map((movie) => (
            <Col key={movie.MovieID}>
              <Card className="h-100" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(movie.MovieID)}>
                <Card.Img
                  variant="top"
                  src={`${process.env.REACT_APP_API}/${movie.Poster}`}
                  alt={movie.MovieName}
                  style={{  objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{movie.MovieName}</Card.Title>
                </Card.Body>
                <Badge bg="danger" className="position-absolute">
                  {movie.AgeTag}
                </Badge>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Showing;
