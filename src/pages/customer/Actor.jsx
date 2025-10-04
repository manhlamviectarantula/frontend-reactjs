import Header from '../../components/Header';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Footer from '../../components/Footer';

// Dữ liệu JSON mẫu
const actors = [
  {
    name: "Chris Hemsworth",
    image: "https://cdn.galaxycine.vn/media/c/h/chris-ngang_1.jpg",
    description: "Nam diễn viên người Úc, nổi tiếng với vai Thor trong Vũ trụ Điện ảnh Marvel."
  },
  {
    name: "Scarlett Johansson",
    image: "https://cdn.galaxycine.vn/media/g/a/gallery-1436740108-elle-aug-15-margot-robbie-02.jpg",
    description: "Nữ diễn viên người Mỹ, từng tham gia nhiều phim nổi tiếng như Black Widow trong MCU."
  },
  {
    name: "Tom Holland",
    image: "https://cdn.galaxycine.vn/media/t/h/theron-charlize-bannner.jpg",
    description: "Nam diễn viên trẻ người Anh, nổi tiếng với vai Spider-Man trong MCU."
  },
  {
    name: "Gal Gadot",
    image: "https://cdn.galaxycine.vn/media/h/u/hu-ngang.jpg",
    description: "Nữ diễn viên và người mẫu người Israel, được biết đến với vai Wonder Woman."
  },
  {
    name: "Leonardo DiCaprio",
    image: "https://cdn.galaxycine.vn/media/5/5_18.jpg",
    description: "Hiện nay, thế giới biết đến Tom Hiddleston với hai biệt danh - “Loki”"
  },
  {
    name: "Leonardo DiCaprio",
    image: "https://cdn.galaxycine.vn/media/l/a/la-ngang_1.jpg",
    description: "Đang cập nhật..."
  },
  {
    name: "Leonardo DiCaprio",
    image: "https://cdn.galaxycine.vn/media/3/3_204.jpg",
    description: "Đang cập nhật..."
  },
  {
    name: "Leonardo DiCaprio",
    image: "https://cdn.galaxycine.vn/media/s/c/scarlett_johansson.jpg",
    description: "Đang cập nhật..."
  },
  {
    name: "Leonardo DiCaprio",
    image: "https://cdn.galaxycine.vn/media/4/4_179.jpg",
    description: "Đang cập nhật..."
  },
  {
    name: "Leonardo DiCaprio",
    image: "https://cdn.galaxycine.vn/media/c/d/cdf.jpg",
    description: "Đang cập nhật..."
  }
];

function Actor() {
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
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Diễn viên nổi bật</h2>
        <Row>
          {actors.map((actor, index) => (
            <Col key={index} md={4} sm={6} xs={12} className="mb-4">
              <Card style={{ height: '100%' }}>
                <Card.Img
                  variant="top"
                  src={actor.image}
                  alt={actor.name}
                  style={{ height: 250, objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{actor.name}</Card.Title>
                  <Card.Text style={{ textAlign: 'justify' }}>
                    {actor.description}
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

export default Actor;
