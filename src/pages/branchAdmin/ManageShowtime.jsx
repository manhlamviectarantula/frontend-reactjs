import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarBranchAdmin from './sidebarBranchAdmin';
import axios from 'axios';
import { store } from '../../redux/store';
import DatePicker from 'react-datepicker';
import { toast, ToastContainer } from 'react-toastify';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { formatDate, formatDatetime, formatShowtimeDate } from '../../lib/utils';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PriorityHigh } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const ManageShowtime = () => {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Kết quả: "2025-03-15"
    });
    const [TheatersOfBranch, setTheatersOfBranch] = useState([])
    const [Showtimes, setShowtimes] = useState([])
    const [DetailsShowtime, setDetailsShowtime] = useState()

    const [MovieOptions, setMovieOptions] = useState([])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showOpenOrderModal, setShowOpenOrderModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [CancelReason, setCancelReason] = useState("");

    const [TheaterID, setTheaterID] = useState("")
    const [TheaterName, setTheaterName] = useState("")
    const [MovieSelected, setMovieSelected] = useState()
    const [MovieID, setMovieID] = useState("")
    const [StartTime, setStartTime] = useState("");
    const handleTimeChange = (time) => {
        const hours = time.getHours().toString().padStart(2, "0");
        const minutes = time.getMinutes().toString().padStart(2, "0");
        setStartTime(`${hours}:${minutes}`);
    };
    const [EndTime, setEndTime] = useState("")

    const isBranchAdmin = store.getState().user.currentUser?.user;

    const addShowtimeClick = (theater) => {
        setTheaterName(theater.TheaterName)
        setTheaterID(theater.TheaterID)
        setShowAddModal(true)
    }

    useEffect(() => {
        setShowtimes([])

        const getAllTheaterOfBranch = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/theater/get-all-theater-of-branch/${isBranchAdmin.BranchID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.data.data.length === 0) {
                    console.warn("Chưa có rạp chiếu nào.");
                }
                setTheatersOfBranch(res.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy rạp chiếu:", error);
            }
        };

        const getShowtimesOfBranch = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-branch/${isBranchAdmin.BranchID}?ShowDate=${selectedDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.data.data.length === 0) {
                    console.warn("Chưa có xuất chiếu nào.");
                }
                setShowtimes(res.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy xuất chiếu:", error);
            }
        }

        const getMovieOptions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/movie/get-movies-in-add-showtime`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(res.data)
                if (res.data.movies.length === 0) {
                    console.warn("Chưa có phim nào.");
                }
                setMovieOptions(res.data.movies);
            } catch (error) {
                console.error("Lỗi khi lấy phim:", error);
            }
        }

        getMovieOptions()
        getShowtimesOfBranch()
        getAllTheaterOfBranch();

    }, [isBranchAdmin.BranchID, selectedDate, token]);

    useEffect(() => {
        if (!MovieSelected?.Duration) return; // Kiểm tra nếu không có thời lượng phim

        const [hours, minutes] = StartTime.split(":").map(Number);

        const startDate = new Date();
        startDate.setHours(hours, minutes, 0);

        // Cộng thêm thời lượng phim (đơn vị phút)
        const endDate = new Date(startDate.getTime() + MovieSelected.Duration * 60000);
        const endHours = endDate.getHours().toString().padStart(2, "0");
        const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

        setEndTime(`${endHours}:${endMinutes}`);
    }, [StartTime, MovieSelected]);

    const handleAddShowtime = async (e) => {
        e.preventDefault();

        if (!TheaterID || !TheaterName || !MovieID || !StartTime || !EndTime) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const formData = new FormData();
        formData.append("TheaterID", TheaterID);
        formData.append("MovieID", MovieID);
        formData.append("ShowDate", selectedDate);
        formData.append("StartTime", StartTime);
        formData.append("EndTime", EndTime);
        formData.append("CreatedBy", isBranchAdmin.Email);

        try {
            const addShowtime = await axios.post(
                `${process.env.REACT_APP_API}/showtime/add-showtime`,
                formData, // body
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`, // ✅ gộp chung
                    },
                }
            );

            await axios.post(
                `${process.env.REACT_APP_API}/showtime-seat/add-showtime-seats/${addShowtime.data.data.ShowtimeID}/${addShowtime.data.data.TheaterID}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Thêm suất chiếu thành công!");

            setTheaterID("");
            setTheaterName("");
            setMovieSelected("");
            setMovieID("");
            setStartTime("");
            setEndTime("");
            setShowAddModal(false);

            const response = await axios.get(
                `${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-branch/${isBranchAdmin.BranchID}?ShowDate=${selectedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.data.length === 0) {
                console.warn("Chưa có xuất chiếu nào.");
            }

            setShowtimes(response.data.data);

        } catch (error) {
            console.error("Error adding showtime:", error);

            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Có lỗi xảy ra khi thêm suất chiếu.");
            }
        }
    };

    const handleDetailsShowtime = async (ShowtimeID) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/showtime/get-details-showtime/${ShowtimeID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Thêm header
                    },
                }
            )

            setDetailsShowtime(response.data.data)
            setShowDetailsModal(true)
        } catch (error) {
            console.error("Error details showtime:", error);
            toast.error("Có lỗi xảy ra lấy thông tin suất chiếu.");
        }
    }

    const handleOpenOrderShowtime = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/showtime/open-order-showtime/${DetailsShowtime.ShowtimeID}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Thêm header
                    }
                }
            );

            toast.success(response.data.message || "Mở đặt vé thành công!");

            // reload lại danh sách suất chiếu
            const res = await axios.get(
                `${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-branch/${isBranchAdmin.BranchID}?ShowDate=${selectedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShowtimes(res.data.data === null ? [] : res.data.data);

            setShowOpenOrderModal(false);
            setShowDetailsModal(false);
        } catch (error) {
            console.error("Error opening order:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Có lỗi xảy ra khi mở đặt vé.");
            }
        }
    }

    const handleDeleteShowtime = async () => {
        try {

            await axios.delete(`${process.env.REACT_APP_API}/showtime-seat/delete-showtime-seats/${DetailsShowtime.ShowtimeID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            await axios.delete(
                `${process.env.REACT_APP_API}/showtime/delete-showtime/${DetailsShowtime.ShowtimeID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Thêm header
                    },
                }
            );

            toast.success("Xóa suất chiếu thành công!");

            const response = await axios.get(`${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-branch/${isBranchAdmin.BranchID}?ShowDate=${selectedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShowtimes(response.data.data === null ? [] : response.data.data);

            setShowDeleteModal(false)
            setShowDetailsModal(false)
        } catch (error) {
            console.error("Error deleting showtime:", error);
            toast.error("Có lỗi xảy ra khi xóa suất chiếu.");
        }
    }

    const handleConfirmCancelShowtime = async () => {
        try {
            const cancelShowtime = await axios.put(
                `${process.env.REACT_APP_API}/showtime/cancel-showtime/${DetailsShowtime.ShowtimeID}`,
                { CancelReason: CancelReason }, // gửi body
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Thêm header
                    },
                }
            );

            toast.success(cancelShowtime.data.message || "Hủy suất chiếu thành công!");

            // load lại danh sách suất chiếu
            const response = await axios.get(
                `${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-branch/${isBranchAdmin.BranchID}?ShowDate=${selectedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShowtimes(response.data.data === null ? [] : response.data.data);

            setShowCancelModal(false);
        } catch (error) {
            console.error("Error canceling showtime:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Có lỗi xảy ra khi hủy suất chiếu.");
            }
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarBranchAdmin} />

                    <Col md={10} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Danh sách suất chiếu:</h4>
                            <div className='d-flex'>
                                <Form.Control
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <TableContainer component={Paper} elevation={3}>
                            <Table size="small" aria-label="Danh sách suất chiếu" sx={{ borderCollapse: "collapse" }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#2c3034" }}>
                                        <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>Rạp</TableCell>
                                        <TableCell sx={{ color: "white", fontWeight: "bold", width: "85%" }}>Suất chiếu</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {TheatersOfBranch.map((theater, index) => {
                                        const filteredShowtimes = Showtimes.filter(
                                            (showtime) => showtime.TheaterID === theater.TheaterID
                                        );

                                        return (
                                            <TableRow key={index}>
                                                <TableCell
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        verticalAlign: "middle",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        color: theater.Status ? "inherit" : "red"
                                                    }}
                                                >
                                                    {theater.TheaterName}
                                                    {!theater.Status && " đang khóa"}
                                                </TableCell>

                                                {/* <TableCell
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        verticalAlign: "middle",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {theater.TheaterName}
                                                </TableCell> */}

                                                {/* Cột suất chiếu */}
                                                <TableCell sx={{ display: "flex", flexWrap: "wrap", gap: 1, p: 2 }}>
                                                    {filteredShowtimes.length > 0 ? (
                                                        filteredShowtimes.map((showtime, idx) => (
                                                            <Box key={idx} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                {/* Poster */}
                                                                <img
                                                                    src={`${showtime.Poster}`}
                                                                    alt="poster"
                                                                    style={{
                                                                        width: "50px",
                                                                        height: "75px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "8px",
                                                                    }}
                                                                />
                                                                {showtime.IsOpenOrder ?
                                                                    <Button
                                                                        onClick={() => handleDetailsShowtime(showtime.ShowtimeID)}
                                                                        style={{
                                                                            marginRight: "20px",
                                                                            height: "100%",
                                                                            width: "55px",
                                                                            padding: "0px",
                                                                            backgroundColor:

                                                                                showtime.Status === 0
                                                                                    ? "#adb5bd"   // xám nhạt
                                                                                    : showtime.Status === 1
                                                                                        ? "#55c4ff"   // xanh dương nhạt
                                                                                        : "#f08080",  // đỏ nhạt
                                                                            color: "white",
                                                                            fontWeight: "bold",
                                                                            border: "none",
                                                                        }}
                                                                    >
                                                                        <div>{formatShowtimeDate(showtime.StartTime)}</div>
                                                                        <KeyboardDoubleArrowDownIcon />
                                                                        <div>{formatShowtimeDate(showtime.EndTime)}</div>
                                                                    </Button>
                                                                    :
                                                                    <Button
                                                                        onClick={() => handleDetailsShowtime(showtime.ShowtimeID)}
                                                                        style={{
                                                                            marginRight: "20px",
                                                                            height: "100%",
                                                                            width: "55px",
                                                                            padding: "0px",
                                                                            backgroundColor: "#FFD966",
                                                                            color: "black",
                                                                            fontWeight: "bold",
                                                                            border: "none",
                                                                        }}
                                                                    >
                                                                        <div>{formatShowtimeDate(showtime.StartTime)}</div>
                                                                        <PriorityHigh />
                                                                        <div>{formatShowtimeDate(showtime.EndTime)}</div>
                                                                    </Button>
                                                                }
                                                            </Box>
                                                        ))
                                                    ) : (
                                                        <span></span>
                                                    )}

                                                    <Button variant="light" style={{ border: "1px solid #d1d1d1", width: "50px", height: '75px' }}
                                                        onClick={() => addShowtimeClick(theater)}
                                                    >
                                                        <strong>+</strong>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                </Row>
            </Container>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập thông tin suất chiếu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddShowtime} encType="multipart/form-data">
                        <Form.Group>
                            <Form.Control
                                type="hidden"
                                name='TheaterID'
                                value={TheaterID}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Rạp chiếu:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='TheaterName'
                                value={TheaterName}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Ngày chiếu:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='ShowDate'
                                value={formatDate(selectedDate)}
                                // value={selectedDate}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Chọn phim chiếu:</strong></Form.Label>
                            <Form.Select
                                name="MovieID"
                                value={MovieID}
                                onChange={(e) => {
                                    const selectedMovie = MovieOptions.find(movie => movie.MovieID === Number(e.target.value));
                                    setMovieID(e.target.value);
                                    setMovieSelected(selectedMovie);
                                }}
                            >
                                <option value="" disabled>Chọn phim...</option> {/* Option mặc định */}
                                {
                                    MovieOptions.map((movie, idx) => {
                                        const truncatedName = movie.MovieName.length > 30
                                            ? movie.MovieName.substring(0, 30) + "..."
                                            : movie.MovieName;
                                        return (
                                            <option key={idx} value={movie.MovieID}>
                                                {truncatedName} - {movie.Duration} phút - {movie.Status === 0 ? `Phim sắp chiếu (${formatDate(movie.ReleaseDate)})` : "Phim đang chiếu"}
                                            </option>
                                        );
                                    })
                                }
                            </Form.Select>
                        </Form.Group>


                        <Form.Group className="mb-3 d-flex">
                            <Form.Label className='me-2'><strong>Bắt đầu chiếu - kết thúc:</strong></Form.Label>
                            <DatePicker
                                selected={(() => {
                                    if (!StartTime) return null; // Nếu chưa có EndTime, trả về null để tránh lỗi

                                    const now = new Date();
                                    const [hours, minutes] = StartTime.split(":").map(Number);

                                    if (isNaN(hours) || isNaN(minutes)) return null; // Kiểm tra tránh lỗi NaN

                                    now.setHours(hours, minutes, 0, 0);
                                    return now;
                                })()}
                                onChange={handleTimeChange}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={5}
                                timeFormat="HH:mm"
                                dateFormat="HH:mm"
                                minTime={new Date().setHours(9, 0, 0)}
                                maxTime={new Date().setHours(22, 0, 0)}
                                customInput={<input style={{ width: "40px" }} />}
                            />
                            <div className='mx-2'><strong>-</strong></div>
                            <DatePicker
                                selected={(() => {
                                    if (!EndTime) return null; // Nếu chưa có EndTime, trả về null để tránh lỗi

                                    const now = new Date();
                                    const [hours, minutes] = EndTime.split(":").map(Number);

                                    if (isNaN(hours) || isNaN(minutes)) return null; // Kiểm tra tránh lỗi NaN

                                    now.setHours(hours, minutes, 0, 0);
                                    return now;
                                })()}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={5}
                                timeFormat="HH:mm"
                                dateFormat="HH:mm"
                                disabled
                                customInput={<input style={{ width: "40px" }} />}
                            />
                        </Form.Group>

                        {/* Khi bấm nút này sẽ mở modal xác nhận */}
                        <Button type="submit" variant="dark" className="w-100">
                            Thêm suất chiếu
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi Tiết Suất Chiếu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {DetailsShowtime && (
                        <>
                            {DetailsShowtime.Status === 0 && (
                                <div className="alert alert-secondary text-center" role="alert">
                                    Đã chiếu
                                </div>
                            )}

                            {DetailsShowtime.Status === 2 && (
                                <div className="alert alert-danger text-center" role="alert">
                                    Bị hủy <br />
                                    <strong>Lý do:</strong> {DetailsShowtime.CancelReason}
                                </div>
                            )}

                            {DetailsShowtime.Status === 1 && (
                                DetailsShowtime.IsOpenOrder === true ? (
                                    <div className="alert alert-primary text-center" role="alert">
                                        Đã mở đặt vé
                                    </div>
                                ) : (
                                    <div className="alert alert-warning text-center" role="alert">
                                        Chưa mở đặt vé !!!
                                    </div>
                                )
                            )}
                            <div>
                                <p><strong>ID:</strong> {DetailsShowtime.ShowtimeID}</p>
                                <p><strong>Rạp chiếu:</strong> {DetailsShowtime.Theater.TheaterName}</p>
                                <p><strong>Mã rạp:</strong> {DetailsShowtime.Theater.Slug}</p>
                                <p><strong>Phim chiếu:</strong> {DetailsShowtime.Movie.MovieName}</p>
                                <p>
                                    <Image
                                        src={`${DetailsShowtime.Movie.Poster}`}
                                        width="30%"
                                        rounded
                                    />
                                </p>
                                <p><strong>Ngày chiếu:</strong> {formatDate(DetailsShowtime.ShowDate)}</p>
                                <p><strong>Bắt đầu:</strong> {DetailsShowtime.StartTime}</p>
                                <p><strong>Kết thúc:</strong> {DetailsShowtime.EndTime}</p>
                                <p>
                                    <strong>Trạng thái:</strong>{" "}
                                    {DetailsShowtime.Status === 0
                                        ? "Đã chiếu"
                                        : DetailsShowtime.Status === 1
                                            ? "Chưa chiếu"
                                            : DetailsShowtime.Status === 2
                                                ? "Bị hủy"
                                                : "Không xác định"}
                                </p>
                                <p className='mt-3'><strong>Thời gian tạo:</strong> {formatDatetime(DetailsShowtime.CreatedAt)}</p>
                                <p><strong>Người tạo:</strong> {DetailsShowtime.CreatedBy}</p>
                                <p className='mt-3'><strong>Lần cập nhật cuối:</strong> {formatDatetime(DetailsShowtime.LastUpdatedAt)}</p>
                                <p><strong>Người cập nhật cuối:</strong> {DetailsShowtime.LastUpdatedBy}</p>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {DetailsShowtime?.IsOpenOrder ?
                        <Button
                            variant="danger"
                            onClick={() => {
                                setShowDetailsModal(false);
                                setShowCancelModal(true);
                            }}
                            disabled={DetailsShowtime?.Status === 2 || DetailsShowtime?.Status === 0}
                        >
                            Hủy Suất Chiếu
                        </Button>
                        :
                        <>
                            <Button variant="primary" onClick={() => {
                                setShowDetailsModal(false);
                                setShowOpenOrderModal(true);
                            }}>
                                Mở đặt vé
                            </Button>
                            <Button variant="danger" onClick={() => {
                                setShowDetailsModal(false);
                                setShowDeleteModal(true);
                            }}>
                                Xóa
                            </Button>
                        </>
                    }
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setShowDetailsModal(true); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa suất chiếu <strong>{DetailsShowtime?.StartTime} - {DetailsShowtime?.Theater.TheaterName}</strong> không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowDetailsModal(true);
                        setShowDeleteModal(false);
                    }}>Hủy</Button>
                    <Button variant="danger" onClick={handleDeleteShowtime}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showOpenOrderModal} onHide={() => { setShowOpenOrderModal(false); setShowDetailsModal(true); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận mở đặt vé</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Một khi <strong>mở đặt vé</strong>, bạn chỉ có thể <strong>Hủy Suất Chiếu</strong> và <strong>hoàn tiền cho khách hàng</strong> chứ không thể xóa.
                    </p>
                    <p>Bạn có chắc chắn muốn mở đặt vé cho suất chiếu <strong>{DetailsShowtime?.StartTime} - {DetailsShowtime?.Theater.TheaterName}</strong> không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowDetailsModal(true);
                        setShowOpenOrderModal(false);
                    }}>Hủy</Button>
                    <Button variant="primary" onClick={handleOpenOrderShowtime}>Xác nhận</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showCancelModal}
                onHide={() => setShowCancelModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận hủy suất chiếu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Bạn có chắc chắn muốn hủy suất chiếu
                        <strong> {DetailsShowtime?.StartTime} - {DetailsShowtime?.Theater.TheaterName}</strong> không?
                    </p>
                    <Form.Group className="mt-3">
                        <Form.Label><strong>Lý do hủy:</strong></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập lý do hủy..."
                            value={CancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        Quay lại
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmCancelShowtime}
                        disabled={!CancelReason.trim()} // bắt buộc nhập lý do
                    >
                        Xác nhận hủy
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageShowtime;
