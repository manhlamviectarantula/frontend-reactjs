export const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="custom-arrow next-arrow"
            onClick={onClick}
        >
            ❯
        </div>
    );
};

export const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="custom-arrow prev-arrow"
            onClick={onClick}
        >
            ❮
        </div>
    );
};

export const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 1,
            },
        },
    ],
};