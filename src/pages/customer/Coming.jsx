import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const movies = [
  { id: 1, name: 'Venom: Kèo Cuối', tag: '18+', image: 'https://cdn.galaxycine.vn/media/2024/10/16/venom-sneak-500_1729048419589.jpg' },
  { id: 2, name: 'Bức Họa Bí Ẩn', tag: '13+', image: 'https://cdn.galaxycine.vn/media/2023/10/17/the-painting-2_1697549479373.jpg' },
  { id: 3, name: 'Ác Quỷ Truy Hồn', tag: '18+', image: 'https://cdn.galaxycine.vn/media/2024/10/11/ac-qu-truy-hon-500_1728616391060.jpg' },
  { id: 4, name: 'Trò Chơi Nhân Tính', tag: '18+', image: 'https://cdn.galaxycine.vn/media/2024/10/8/exit-500_1728383239694.jpg' },
  { id: 5, name: 'Elli Và Bí Ẩn Chiếc Tàu Ma', tag: 'P', image: 'https://cdn.galaxycine.vn/media/2024/9/20/ellie-500_1726817040129.jpg' },
];

const Coming = () => {
  return (
    <>
      <Header />
      <Container className="mt-4 mb-4">
        <div style={{ margin: '30px auto 35px' }}>
          <h4 className='text-center'>
            <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
              PHIM SẮP CHIẾU
            </span>
          </h4>
        </div>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {movies.map((movie) => (
            <Col key={movie.id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={movie.image}
                  alt={movie.name}
                  style={{  objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{movie.name}</Card.Title>
                </Card.Body>
                <Badge bg="danger" className="position-absolute">
                  {movie.tag}
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

export default Coming;
