import Carousel from 'react-bootstrap/Carousel';

const carouselItems = [
    {
        src: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/3/_/3.cgv-980x448.png",
        alt: "First slide",
    },
    {
        src: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_rolling_banner.png",
        alt: "Second slide",
    },
    {
        src: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980-x-448-cgv.jpg",
        alt: "Third slide",
    },
    {
        src: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/1/0/10yrs_kv__rbanner_1_.jpg",
        alt: "Fourth slide",
    },
];

const CarouselHome2 = () => {
    return (
        <>
            <div className="text-center mb-4">
                <h4 style={{ borderTop: '3px dashed black', borderBottom: '3px dashed black', padding: '5px 0' }}>ĐỐI TÁC & QUÀ TẶNG</h4>
            </div>
            <Carousel
                style={{
                    backgroundImage:
                        'url("https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?cs=srgb&dl=pexels-jplenio-1103970.jpg&fm=jpg")',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center 50%",
                }}
            >
                {carouselItems.map((item, index) => (
                    <Carousel.Item key={index}>
                        <img
                            style={{ height: "70vh", objectFit: "none" }}
                            className="d-block w-100"
                            src={item.src}
                            alt={item.alt}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        </>
    );
};

export default CarouselHome2;
