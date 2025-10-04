import Header from '../../components/Header';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Footer from '../../components/Footer';

// Dữ liệu JSON mẫu
const directors = [
  {
    name: "Christopher Nolan",
    image: "https://cdn.galaxycine.vn/media/w/a/wan1.jpg",
    description: "Đạo diễn người Anh-Mỹ, nổi tiếng với loạt phim Inception, Interstellar, The Dark Knight."
  },
  {
    name: "James Cameron",
    image: "https://cdn.galaxycine.vn/media/l/e/lebaotrung.jpg",
    description: "Đạo diễn người Canada, nổi tiếng với Titanic, Avatar, Terminator 2."
  },
  {
    name: "Quentin Tarantino",
    image: "https://cdn.galaxycine.vn/media/1/1_296.jpg",
    description: "Đạo diễn Mỹ, nổi tiếng với phong cách độc đáo qua Pulp Fiction, Kill Bill."
  },
  {
    name: "Martin Scorsese",
    image: "https://cdn.galaxycine.vn/media/n/g/ngoc-giau-ngang.jpg",
    description: "Một trong những đạo diễn vĩ đại nhất Hollywood, nổi tiếng với Taxi Driver, The Irishman."
  },
  {
    name: "Denis Villeneuve",
    image: "https://cdn.galaxycine.vn/media/1/1_282.jpg",
    description: "Đang cập nhật"
  },
  {
    name: "Denis Villeneuve",
    image: "https://cdn.galaxycine.vn/media/v/u/vu-ngoc-phuong-ngang.jpg",
    description: "Đang cập nhật"
  },
  {
    name: "Denis Villeneuve",
    image: "https://cdn.galaxycine.vn/media/v/i/vietmax-ngang.jpg",
    description: "Đang cập nhật"
  },
  {
    name: "Denis Villeneuve",
    image: "https://cdn.galaxycine.vn/media/h/a/hamtran450.jpg",
    description: "Đang cập nhật"
  },
  {
    name: "Denis Villeneuve",
    image: "https://cdn.galaxycine.vn/media/l/a/lamledung-ngang.jpg",
    description: "Đang cập nhật"
  },
  {
    name: "Denis Villeneuve",
    image: "https://cdn.galaxycine.vn/media/b/a/bay-ngang.png",
    description: "Đang cập nhật"
  }
];

function Director() {
  return (
    <>
      <Header />
      <Container
        style={{
          padding: '20px',
          margin: '30px auto',
          border: '1.5px solid #212121',
          borderRadius: 4
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Danh sách đạo diễn</h2>
        <Row>
          {directors.map((director, index) => (
            <Col key={index} md={4} sm={6} xs={12} className="mb-4">
              <Card style={{ height: '100%' }}>
                <Card.Img
                  variant="top"
                  src={director.image}
                  alt={director.name}
                  style={{ height: 250, objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{director.name}</Card.Title>
                  <Card.Text style={{ textAlign: 'justify' }}>
                    {director.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Director;
