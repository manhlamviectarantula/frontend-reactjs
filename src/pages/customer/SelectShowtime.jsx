import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Footer from "../../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { DoubleArrow } from "@mui/icons-material";
import { getShowDates } from "../../lib/utils";

const SelectShowtime = () => {
  const [showDates, setShowDates] = useState([])
  const [selectedDate, setSelectedDate] = useState("");
  const [showtimes, setShowtimes] = useState([])

  const location = useLocation();
  const { MovieName, Poster } = location.state || {};
  const MovieID = location.pathname.split("/")[2];
  const navigate = useNavigate();

  useEffect(() => {
    setShowDates(getShowDates(7));
    if (!selectedDate) return;

    const getShowtimeOfDate = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/showtime/get-showtimes-of-date/${MovieID}?showdate=${selectedDate}`
        );

        if (res.data?.data && Array.isArray(res.data.data)) {
          setShowtimes(res.data.data);
        } else {
          setShowtimes([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy suất chiếu:", error);
        setShowtimes([]);
      }
    };

    getShowtimeOfDate();
  }, [selectedDate, MovieID]);

  // Hàm xử lý khi chọn suất chiếu
  const handleSelectShowtime = (ShowtimeID) => {
    navigate(`/selectSeat/${ShowtimeID}`);
  };

  return (
    <>
      <Header />
      <Container className="my-4">
        <div style={{ margin: '30px auto 35px' }}>
          <h4 className='text-center'>
            <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
              SUẤT CHIẾU
            </span>
          </h4>
        </div>
        <Row>
          <Col md={3}>
            <div className="w-100 mt-2 mb-3 text-center">
              <h3>{MovieName}</h3>
            </div>
            <Card.Img
              variant="top"
              src={`${process.env.REACT_APP_API}/${Poster}`}
              className="w-100 rounded"
            />
          </Col>
          <Col md={9} style={{ borderLeft: '2px dashed black', paddingLeft: '20px' }}>
            <div className="d-flex" style={{ margin: "10px auto 10px" }}>
              <DoubleArrow className="mt-1 mx-2"></DoubleArrow>
              <h4>
                Chọn ngày chiếu
              </h4>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap", 
                overflowX: "auto", 
              }}
            >
              {showDates.map((date) => (
                <Button
                  key={date.value}
                  variant={selectedDate === date.value ? "dark" : "outline-dark"}
                  onClick={() => setSelectedDate(date.value)}
                  style={{
                    width: "105px",
                    height: "60px",
                    fontSize: "14px",
                    padding: "0",
                    margin: "6px",
                    borderRadius: "0px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: "0 0 auto", 
                  }}
                >
                  <div style={{ fontSize: "12px" }}>{date.weekday}</div>
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>{date.label}</div>
                </Button>
              ))}
            </div>

            {!selectedDate ? (
              <></>
            ) : (
              <>
                <div
                  className="d-flex"
                  style={{
                    margin: "10px auto 0px",
                    borderTop: "2px dashed black",
                    paddingTop: "20px",
                  }}
                >
                  <DoubleArrow className="mt-1 mx-2" />
                  <h4>Chọn giờ chiếu</h4>
                </div>
                {showtimes.length === 0 ? (
                  <div className="mt-2">Chưa có suất chiếu trong ngày</div>
                ) : (
                  showtimes.map((branch) => (
                    <div
                      key={branch.BranchName}
                      style={{
                        marginBottom: "15px",
                        borderBottom: "1px solid black",
                        paddingBottom: "15px",
                      }}
                    >
                      <div className="d-flex">
                        <h6 className="mt-2 mb-3">| {branch.BranchName}</h6>
                      </div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {branch.Showtimes.map((show) => (
                          <Button
                            key={show.ShowtimeID}
                            variant="outline-dark"
                            style={{ borderRadius: "0px" }}
                            onClick={() => handleSelectShowtime(show.ShowtimeID)}
                          >
                            {show.StartTime}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default SelectShowtime;
