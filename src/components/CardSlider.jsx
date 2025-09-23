import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NextArrow = ({ onClick }) => (
  <div className="arrow next" onClick={onClick}>
    <ArrowForwardIcon fontSize="large" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="arrow prev" onClick={onClick}>
    <ArrowBackIcon fontSize="large" />
  </div>
);

const CardSlider = () => {
  const cards = [
    {
      image: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/z/5/z5701320082303_bd9cb127e9cd0652329054662900294e.jpg",
    },
    {
      image: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/z/5/z5701320082202_20fbb5c8a2f2747f89d1c95f6b541f57.jpg",
    },
    {
      image: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/b/i/birthday_popcorn_box_240x201.png",
    },
    {
      image: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/2/4/240x201_3_2.png",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="text-center mt-5">
        <h4 style={{ borderTop: '3px dashed black', borderBottom: '3px dashed black', padding: '5px 0' }}>TIN MỚI & ƯU ĐÃI</h4>
      </div>
      <div className="slider-container">
        <Slider {...settings}>
          {cards.map((card, index) => (
            <div key={index} className="cardSlider">
              <img src={card.image} alt={card.title} className="card-image" />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default CardSlider;
