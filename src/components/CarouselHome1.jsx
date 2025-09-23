import Carousel from 'react-bootstrap/Carousel';

const carouselItems = [
  {
    src: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_22_-min.jpg",
    alt: "First slide",
  },
  {
    src: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448-min_1__7.png",
    alt: "Second slide",
  },
  {
    src: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980wx448h_7_.jpg",
    alt: "Third slide",
  },
  {
    src: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/r/s/rsz_cgv_980x448.jpg",
    alt: "Fourth slide",
  },
];

const CarouselHome1 = () => {
  return (
    <Carousel
      style={{
        backgroundImage:
          'url("https://www.valleycentral.com/wp-content/uploads/sites/39/2022/09/movie-theater-popcorn.jpg?w=2560&h=1440&crop=1")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 50%",
      }}
    >
      {carouselItems.map((item, index) => (
        <Carousel.Item key={index}>
          <img
            style={{ height: "70vh", objectFit: "none"}}
            className="d-block w-100"
            src={item.src}
            alt={item.alt}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselHome1;
