import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarBranchAdmin from './sidebarBranchAdmin';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { formatBranchSlug, formatDatetime, removeVietnameseTones } from '../../lib/utils';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { ChairOutlined, KeyboardDoubleArrowRight, Lock, LockOpen } from '@mui/icons-material';

const ManageTheater = () => {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const isBranchAdmin = useSelector(state => state.user.currentUser?.user);
    const branchName = isBranchAdmin?.BranchName || '';

    const [Theaters, setTheaters] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false)
    const [seatDataModal, setSeatDataModal] = useState(false)
    const [updatePositionModal, setUpdatePositionModal] = useState(false)
    const [DetailsTheater, setDetailsTheater] = useState(null)
    const [seatingData, setSeatingData] = useState({ rows: [], maxColumn: 0, maxRow: 0 });

    const [showAddTheaterModal, setshowAddTheaterModal] = useState(false)
    const [theaterInfo, setTheaterInfo] = useState({
        BranchID: isBranchAdmin.BranchID || '',
        TheaterName: '',
        Slug: '',
        TheaterType: '',
        MaxRow: '',
        MaxColumn: '',
        SeatsPrice: 0,
        CreatedBy: isBranchAdmin.Email || '',
        LastUpdatedBy: isBranchAdmin.Email || ''
    });

    const [updateSeatInfo, setUpdateSeatInfo] = useState({
        MaxRow: '',
        MaxColumn: '',
        LastUpdatedBy: isBranchAdmin.Email || ''
    })

    const [editTheaterInfo, setEditTheaterInfo] = useState(null);

    useEffect(() => {
        if (!isBranchAdmin.BranchID) return;
        const getTheaters = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/theater/get-all-theater-of-branch/${isBranchAdmin.BranchID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTheaters(response.data.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách rạp:', error);
            }
        };
        getTheaters();
    }, [isBranchAdmin.BranchID, token]);

    const [showDesignSeats, setshowDesignSeats] = useState(false)
    const [showDesignUpdateSeatsPosition, setshowDesignUpdateSeatsPosition] = useState(false)
    const [insertSeatsData, setInsertSeatsData] = useState([]);
    const maxRow = parseInt(theaterInfo?.MaxRow || 0, 10);
    const maxRowUpdate = parseInt(updateSeatInfo?.MaxRow || 0, 10);
    const rowNames = Array.from({ length: maxRow }, (_, i) => String.fromCharCode(65 + (maxRow - i - 1)));
    const rowNamesUpdate = Array.from({ length: maxRowUpdate }, (_, i) => String.fromCharCode(65 + (maxRowUpdate - i - 1)));


    const ShowDetailsTheater = (TheaterID) => {
        const getDetailsTheater = async () => {
            if (!TheaterID) return;
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/theater/get-details-theater/${TheaterID}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data?.data) {
                    setDetailsTheater(response.data.data);
                    setEditTheaterInfo(response.data.data); // 🎯 Khởi tạo state để edit
                }
            } catch (error) {
                console.error('Error fetching Theater details:', error);
            }
        };
        getDetailsTheater();
        setShowEditModal(true);
    };

    const ShowSeatData = (TheaterID) => {
        const getDetailsTheater = async () => {
            if (!TheaterID) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/theater/get-details-theater/${TheaterID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data?.data) {
                    setDetailsTheater(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching Branch details:', error);
            }
        };

        const getSeatingData = async () => {
            if (!TheaterID) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/theater/get-seats-of-theater/${TheaterID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Seating Data Response:", response.data);
                if (response.data && response.data.rows) {
                    setSeatingData(response.data);
                    console.log(response.data)
                }
            } catch (error) {
                console.error('Error fetching Branch details:', error);
            }
        };

        getSeatingData()
        getDetailsTheater();

        setSeatDataModal(true)
    }

    const renderSeats = (row) => {
        const seatColumnMap = Array(seatingData.maxColumn).fill(null);
        row.seats.forEach((seat) => {
            seatColumnMap[seat.Column] = seat;
        });

        return seatColumnMap.map((seat, columnIndex) => (
            <Button
                key={columnIndex}
                variant={seat ? "outline-danger" : "outline-light"} // Ghế tồn tại hoặc không
                disabled={!seat} // Không bấm được nếu không có ghế
                style={{
                    width: "22px",
                    height: "22px",
                    fontSize: "14px",
                    margin: "0 3px",
                    padding: "0"
                }}
                onClick={() => handleSeatClickDetails(seat)}
            >
                {seat ? seat.SeatNumber : ""}
            </Button>
        ));
    };

    const handleSeatClickDetails = (seat) => {
        console.log(seat)
    }

    const AddTheaterClick = () => {
        setshowAddTheaterModal(true)
    }

    const toDesignSeats = () => {
        // console.log(theaterInfo)
        if (
            !theaterInfo.BranchID ||
            !theaterInfo.TheaterName ||
            !theaterInfo.Slug ||
            !theaterInfo.TheaterType ||
            !theaterInfo.MaxRow ||
            !theaterInfo.MaxColumn ||
            !theaterInfo.SeatsPrice ||
            !theaterInfo.CreatedBy ||
            !theaterInfo.LastUpdatedBy
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (theaterInfo?.MaxRow && theaterInfo?.MaxColumn) {
            const maxRow = parseInt(theaterInfo.MaxRow, 10);
            const maxColumn = parseInt(theaterInfo.MaxColumn, 10);
            let seats = [];

            for (let row = 0; row < maxRow; row++) {
                let rowName = String.fromCharCode(65 + (maxRow - row - 1));

                for (let col = 0; col < maxColumn; col++) {
                    seats.push({
                        SeatNumber: maxColumn - col,
                        Row: row,  // Chỉ lưu chỉ số hàng, chưa có RowID
                        RowName: rowName,
                        Column: col,
                        Area: 1,
                        Description: "Standard"
                    });
                }
            }

            setshowDesignSeats(true)
            setshowAddTheaterModal(false)
            setInsertSeatsData(seats);
        }
    }

    const toUpdateSeatsPosiston = () => {
        if (
            !updateSeatInfo.MaxRow ||
            !updateSeatInfo.MaxColumn ||
            !updateSeatInfo.LastUpdatedBy
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (updateSeatInfo?.MaxRow && updateSeatInfo?.MaxColumn) {
            const maxRow = parseInt(updateSeatInfo.MaxRow, 10);
            const maxColumn = parseInt(updateSeatInfo.MaxColumn, 10);
            let seats = [];

            for (let row = 0; row < maxRow; row++) {
                let rowName = String.fromCharCode(65 + (maxRow - row - 1));

                for (let col = 0; col < maxColumn; col++) {
                    seats.push({
                        SeatNumber: maxColumn - col,
                        Row: row,  // Chỉ lưu chỉ số hàng, chưa có RowID
                        RowName: rowName,
                        Column: col,
                        Area: 1,
                        Description: "Standard"
                    });
                }
            }

            setshowDesignUpdateSeatsPosition(true)
            setUpdatePositionModal(false)
            setInsertSeatsData(seats);
        }
    }

    const handleSeatClickDesign = (seat) => {
        setInsertSeatsData(prevSeats => {
            let updatedSeats;
            const existingSeat = prevSeats.find(s => s.Row === seat.Row && s.Column === seat.Column);

            if (existingSeat) {
                // ❌ Xóa ghế nếu đã tồn tại
                updatedSeats = prevSeats.filter(s => !(s.Row === seat.Row && s.Column === seat.Column));
            } else {
                // ✅ Thêm ghế mới vào danh sách nhưng không cần RowID
                updatedSeats = [...prevSeats, {
                    ...seat,
                    Description: seat.Description || "Standard"
                }];
            }

            // Lọc ghế của hàng hiện tại
            const currentRowSeats = updatedSeats.filter(s => s.Row === seat.Row);

            // Sắp xếp lại theo Column giảm dần
            const reindexedSeats = currentRowSeats
                .sort((a, b) => b.Column - a.Column)
                .map((s, index) => ({ ...s, SeatNumber: index + 1 }));

            // Gộp lại danh sách ghế mới
            const finalSeats = updatedSeats
                .filter(s => s.Row !== seat.Row) // Giữ nguyên các hàng khác
                .concat(reindexedSeats);

            return finalSeats;
        });
    };

    const generateRows = async (theaterID) => {
        const maxRow = parseInt(theaterInfo.MaxRow, 10);
        const rows = Array.from({ length: maxRow }, (_, i) => ({
            TheaterID: theaterID,
            RowName: String.fromCharCode(65 + i)
        }));

        const rowsResponse = await axios.post(`${process.env.REACT_APP_API}/row/add-rows`, rows,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return rowsResponse.data.data;
    };

    const generateRowsUpdatePosition = async (theaterID) => {
        const maxRow = parseInt(updateSeatInfo.MaxRow, 10);
        const rows = Array.from({ length: maxRow }, (_, i) => ({
            TheaterID: theaterID,
            RowName: String.fromCharCode(65 + i)
        }));

        const rowsResponse = await axios.post(`${process.env.REACT_APP_API}/row/add-rows`, rows,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return rowsResponse.data.data;
    };

    const createTheaterAndSeats = async () => {
        try {
            const theaterResponse = await axios.post(`${process.env.REACT_APP_API}/theater/add-theater`, theaterInfo,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const theaterID = theaterResponse.data.data.TheaterID;
            console.log("Theater Created:", theaterResponse.data);

            // Tạo hàng ghế và lấy danh sách RowID
            const rowsData = await generateRows(theaterID);

            // Cập nhật danh sách ghế với RowID từ rowsData
            const updatedSeats = insertSeatsData.map(seat => {
                const matchingRow = rowsData.find(row => row.RowName === seat.RowName);
                return matchingRow ? { ...seat, RowID: matchingRow.RowID } : seat;
            });

            setInsertSeatsData(updatedSeats); // Lưu danh sách ghế đã cập nhật RowID

            // Gửi request tạo ghế
            const seatsResponse = await axios.post(`${process.env.REACT_APP_API}/seat/add-seats`, updatedSeats,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Seats Created:", seatsResponse.data);

            // alert("Rạp chiếu, hàng ghế và ghế đã được tạo thành công!");
            toast.success("Tạo rạp chiếu thành công!");
            setshowDesignSeats(false)
            if (!isBranchAdmin.BranchID) return;
            const getTheaters = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API}/theater/get-all-theater-of-branch/${isBranchAdmin.BranchID}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setTheaters(response.data.data || []);
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách rạp:', error);
                }
            };
            getTheaters();
            setTheaterInfo({
                BranchID: isBranchAdmin.BranchID || '',
                TheaterName: '',
                Slug: '',
                TheaterType: '',
                MaxRow: '',
                MaxColumn: '',
                SeatsPrice: 0,
                CreatedBy: isBranchAdmin.Email || '',
                LastUpdatedBy: isBranchAdmin.Email || ''
            });

        } catch (error) {
            console.error("Lỗi khi tạo rạp chiếu:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    };

    const updateSeatsPosition = async () => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API}/theater/update-col-row/${DetailsTheater?.TheaterID}`,
                updateSeatInfo,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await axios.put(`${process.env.REACT_APP_API}/theater/delete-rows-and-seats/${DetailsTheater?.TheaterID}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Tạo hàng ghế và lấy danh sách RowID
            const rowsData = await generateRowsUpdatePosition(DetailsTheater?.TheaterID);

            // Cập nhật danh sách ghế với RowID từ rowsData
            const updatedSeats = insertSeatsData.map(seat => {
                const matchingRow = rowsData.find(row => row.RowName === seat.RowName);
                return matchingRow ? { ...seat, RowID: matchingRow.RowID } : seat;
            });

            setInsertSeatsData(updatedSeats); // Lưu danh sách ghế đã cập nhật RowID

            // Gửi request tạo ghế
            const seatsResponse = await axios.post(`${process.env.REACT_APP_API}/seat/add-seats`, updatedSeats,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Seats Created:", seatsResponse.data);

            // alert("Rạp chiếu, hàng ghế và ghế đã được tạo thành công!");
            toast.success("Sửa vị trí ghế thành công!");
            setshowDesignUpdateSeatsPosition(false)
            if (!isBranchAdmin.BranchID) return;
            const getTheaters = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API}/theater/get-all-theater-of-branch/${isBranchAdmin.BranchID}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setTheaters(response.data.data || []);
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách rạp:', error);
                }
            };
            getTheaters();
            setUpdateSeatInfo({
                MaxRow: '',
                MaxColumn: '',
                LastUpdatedBy: isBranchAdmin.Email || ''
            });


        } catch (error) {
            console.error("Lỗi khi tạo rạp chiếu:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    }

    const handleChangeStatus = async (e, Theater) => {
        e.preventDefault();

        try {
            // Gọi API đổi trạng thái
            await axios.put(
                `${process.env.REACT_APP_API}/theater/change-theater-status/${Theater.TheaterID}`,
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            toast.success("Đã đổi trạng thái rạp chiếu thành công!");

            setTheaters((prevTheaters) =>
                prevTheaters.map((t) =>
                    t.TheaterID === Theater.TheaterID
                        ? { ...t, Status: t.Status === true ? false : true }
                        : t
                )
            );
        } catch (error) {
            console.error("Error toggling theater status:", error);
            toast.error(
                error.response?.data?.error || "Có lỗi xảy ra khi đổi trạng thái rạp chiếu."
            );
        }
    };

    useEffect(() => {
        if (theaterInfo.TheaterName) {
            const theaterSlug = removeVietnameseTones(theaterInfo.TheaterName.toLowerCase());
            const branchSlug = formatBranchSlug(branchName);
            setTheaterInfo(prevData => ({
                ...prevData,
                Slug: `${theaterSlug}${branchSlug}`
            }));
        }
    }, [theaterInfo.TheaterName, branchName]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarBranchAdmin} />

                    <Col md={10} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4 >Danh sách rạp chiếu:</h4>
                            <div>
                                <Button className="ms-2" variant="secondary"
                                    onClick={() => AddTheaterClick()}>
                                    Thêm rạp chiếu
                                </Button>
                            </div>
                        </div>
                        <TableContainer component={Paper} elevation={4}>
                            <Table size='small' aria-label='Danh sách rạp chiếu' sx={{ borderColapse: 'collapse' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#2c3034' }}>
                                        <TableCell sx={{ color: 'white' }}><b>ID</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Tên rạp</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Loại rạp</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Trạng thái</b></TableCell>
                                        <TableCell sx={{ color: 'white' }} align="center" colSpan={3}><b>Tùy chỉnh</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Theaters.map((Theater) => (
                                        <TableRow key={Theater.TheaterID}>
                                            <TableCell>{Theater.TheaterID}</TableCell>
                                            <TableCell>{Theater.TheaterName}</TableCell>
                                            <TableCell>{Theater.TheaterType}</TableCell>
                                            <TableCell sx={{ color: Theater.Status ? "green" : "red" }}>
                                                {Theater.Status ? "Hoạt động" : "Đang khóa"}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Thông tin rạp chiếu">
                                                    <IconButton color="primary" onClick={() => ShowDetailsTheater(Theater.TheaterID)}>
                                                        <KeyboardDoubleArrowRight fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Vị trí ghế ngồi">
                                                    <IconButton color="primary" onClick={() => ShowSeatData(Theater.TheaterID)}>
                                                        <ChairOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title={Theater.Status ? "Khóa rạp" : "Mở rạp"}>
                                                    <IconButton
                                                        color={Theater.Status ? "error" : "success"}
                                                        onClick={(e) => handleChangeStatus(e, Theater)}
                                                    >
                                                        {Theater.Status ? (
                                                            <Lock fontSize="small" />
                                                        ) : (
                                                            <LockOpen fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                </Row>
            </Container>

            {/* Modal SeatsData */}
            <Modal show={seatDataModal} onHide={() => setSeatDataModal(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Vị trí ghế ngồi - {DetailsTheater?.TheaterName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Số hàng ghế:</strong></Form.Label>
                            <Form.Control className='mb-3' type="text" value={DetailsTheater?.MaxRow} readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Số cột ghế:</strong></Form.Label>
                            <Form.Control className='mb-3' type="text" value={DetailsTheater?.MaxColumn} readOnly />
                        </Form.Group>
                    </Form>
                    <div className="py-3 d-flex justify-content-between align-items-center">
                        <h4>Vị trí ghế ngồi:</h4>
                    </div>
                    <div style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                        {seatingData && seatingData.rows && seatingData.rows.length > 0 ? (
                            seatingData.rows.map((row, rowIndex) => (
                                <div key={rowIndex} className='d-flex justify-content-between align-items-center mb-2'>
                                    <div>{row.name}</div>
                                    <div>{renderSeats(row)}</div>
                                    <div>{row.name}</div>
                                </div>
                            ))
                        ) : (
                            <p>Đang tải dữ liệu ghế...</p>
                        )}

                        <p className='text-center text-secondary mb-2 mt-4'>Màn hình</p>
                        <div className='border border-2 border-secondary'></div>
                    </div>

                    <Button
                        onClick={() => {
                            setUpdatePositionModal(true);
                            setSeatDataModal(false);
                        }}
                        variant="dark"
                        className="mt-2 w-100"
                    >
                        Sửa vị trí ghế
                    </Button>

                </Modal.Body>
            </Modal>

            {/* Modal Details Theater */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin rạp chiếu:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editTheaterInfo && (
                        <Form>
                            {/* Tên rạp */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Tên rạp:</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editTheaterInfo.TheaterName}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        const theaterSlug = removeVietnameseTones(newName.toLowerCase());
                                        const branchSlug = formatBranchSlug(branchName);
                                        setEditTheaterInfo(prev => ({
                                            ...prev,
                                            TheaterName: newName,
                                            Slug: `${theaterSlug}${branchSlug}`
                                        }));
                                    }}
                                />
                            </Form.Group>

                            {/* Loại rạp */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Loại rạp:</strong></Form.Label>
                                <Form.Select
                                    value={editTheaterInfo.TheaterType}
                                    onChange={(e) => setEditTheaterInfo(prev => ({ ...prev, TheaterType: e.target.value }))}
                                >
                                    <option value="">-- Chọn loại rạp --</option>
                                    <option value="2D">2D</option>
                                    <option value="3D">3D</option>
                                    <option value="IMAX">IMAX</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label><strong>Giá ghế:</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="SeatsPrice"
                                    value={editTheaterInfo.SeatsPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || ""}
                                    onChange={(e) => {
                                        // Loại bỏ mọi ký tự không phải số
                                        const rawValue = e.target.value.replace(/\D/g, "");

                                        // Cập nhật state với giá trị dạng số nguyên
                                        setEditTheaterInfo({
                                            ...editTheaterInfo,
                                            SeatsPrice: Number(rawValue)
                                        });
                                    }}
                                />
                            </Form.Group>

                            {/* Slug */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Mã rạp:</strong></Form.Label>
                                <Form.Control type="text" value={editTheaterInfo.Slug} readOnly />
                            </Form.Group>

                            {/* Ngày tạo & người tạo */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Ngày tạo:</strong></Form.Label>
                                <Form.Control type="text" value={formatDatetime(editTheaterInfo.CreatedAt)} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Người tạo:</strong></Form.Label>
                                <Form.Control type="text" value={editTheaterInfo.CreatedBy} readOnly />
                            </Form.Group>

                            {/* Lần sửa & người sửa */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Lần sửa cuối:</strong></Form.Label>
                                <Form.Control type="text" value={formatDatetime(editTheaterInfo.LastUpdatedAt)} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Người sửa cuối:</strong></Form.Label>
                                <Form.Control type="text" value={editTheaterInfo.LastUpdatedBy} readOnly />
                            </Form.Group>

                            {/* Nút lưu thay đổi */}
                            <Button
                                variant="dark"
                                className="w-100 mt-3"
                                onClick={async () => {
                                    try {
                                        const response = await axios.put(
                                            `${process.env.REACT_APP_API}/theater/update-theater/${editTheaterInfo.TheaterID}`,
                                            editTheaterInfo,
                                            { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        toast.success("Cập nhật rạp chiếu thành công!");
                                        setShowEditModal(false);

                                        // Cập nhật lại danh sách rạp
                                        setTheaters(prev => prev.map(t =>
                                            t.TheaterID === response.data.data.TheaterID
                                                ? response.data.data
                                                : t
                                        ));
                                    } catch (error) {
                                        console.error(error);
                                        toast.error("Cập nhật thất bại, vui lòng thử lại!");
                                    }
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal Add Theater */}
            <Modal show={showAddTheaterModal} onHide={() => setshowAddTheaterModal(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Nhập thông tin rạp chiếu:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên rạp:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="TheaterName"
                                value={theaterInfo.TheaterName}
                                onChange={(e) => setTheaterInfo({ ...theaterInfo, TheaterName: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Loại rạp:</strong></Form.Label>
                            <Form.Select
                                name="TheaterType"
                                value={theaterInfo.TheaterType}
                                onChange={(e) => setTheaterInfo({ ...theaterInfo, TheaterType: e.target.value })}
                            >
                                <option value="">-- Chọn loại rạp --</option>
                                <option value="2D">2D</option>
                                <option value="3D">3D</option>
                                <option value="IMAX">IMAX</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Giá ghế:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="SeatsPrice"
                                value={theaterInfo.SeatsPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || ""}
                                onChange={(e) => {
                                    // Loại bỏ mọi ký tự không phải số
                                    const rawValue = e.target.value.replace(/\D/g, "");

                                    // Cập nhật state với giá trị dạng số nguyên
                                    setTheaterInfo({
                                        ...theaterInfo,
                                        SeatsPrice: Number(rawValue)
                                    });
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mã rạp:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="Slug"
                                value={theaterInfo.Slug}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Số hàng ghế:</strong></Form.Label>
                            <Form.Control
                                type="number"
                                name="MaxRow"
                                value={theaterInfo.MaxRow}
                                onChange={(e) => setTheaterInfo({
                                    ...theaterInfo,
                                    MaxRow: parseInt(e.target.value, 10) || '' // Ép kiểu thành số nguyên, nếu rỗng thì về 0
                                })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Số cột ghế:</strong></Form.Label>
                            <Form.Control
                                type="number"
                                name="MaxColumn"
                                value={theaterInfo.MaxColumn}
                                onChange={(e) => setTheaterInfo({
                                    ...theaterInfo,
                                    MaxColumn: parseInt(e.target.value, 10) || '' // Ép kiểu thành số nguyên, nếu rỗng thì về 0
                                })}
                            />
                        </Form.Group>

                        <Button onClick={toDesignSeats} variant="dark" className="w-100">
                            Tiếp tục
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Design Seat */}
            <Modal show={showDesignSeats} onHide={() => setshowDesignSeats(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Thiết kế vị trí ghế:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <Button
                                onClick={() => { setshowDesignSeats(false); setshowAddTheaterModal(true) }}
                                variant="dark"
                            >
                                Quay lại
                            </Button>
                            <Button
                                variant='secondary'
                                onClick={() => createTheaterAndSeats()}
                            >
                                Tạo rạp chiếu
                            </Button>
                        </div>
                        <div style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                            {rowNames.map((rowName, rowIndex) => {
                                // Tạo danh sách chỗ ngồi của hàng hiện tại
                                const seatColumnMap = Array.from({ length: parseInt(theaterInfo.MaxColumn, 10) }).fill(null);

                                insertSeatsData
                                    .filter(seat => seat.Row === rowIndex)
                                    .forEach(seat => {
                                        seatColumnMap[seat.Column] = seat;
                                    });

                                return (
                                    <div key={rowIndex} className="d-flex justify-content-between align-items-center mb-2">
                                        {/* Tên hàng bên trái */}
                                        <div style={{ width: "30px", textAlign: "center" }}>{rowName}</div>

                                        {/* Dãy ghế */}
                                        <div className="d-flex">
                                            {seatColumnMap.map((seat, columnIndex) => (
                                                <Button
                                                    key={columnIndex}
                                                    variant={seat ? "outline-danger" : "outline-secondary"}
                                                    onClick={() => {
                                                        const seatData = seat || {
                                                            Row: rowIndex,
                                                            Column: columnIndex,
                                                            RowName: rowName,
                                                            Area: 1,
                                                            SeatNumber: parseInt(theaterInfo.MaxColumn, 10) - columnIndex
                                                        };
                                                        handleSeatClickDesign(seatData)
                                                    }}
                                                    style={{
                                                        width: "22px",
                                                        height: "22px",
                                                        fontSize: "14px",
                                                        margin: "0 3px",
                                                        padding: "0"
                                                    }}
                                                >
                                                    {seat ? seat.SeatNumber : "+"}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Tên hàng bên phải */}
                                        <div style={{ width: "30px", textAlign: "center" }}>{rowName}</div>
                                    </div>
                                );
                            })}
                            <p className="text-center text-secondary mb-2 mt-4">Màn hình</p>
                            <div className="border border-2 border-secondary mb-2"></div>
                            <div>Lưu ý: thiết kế vị trí ghế ngồi của rạp chiếu để đồng nhất với rạp chiếu đã được xây dựng ở chi nhánh</div>
                        </div>
                    </>
                </Modal.Body>
            </Modal>

            {/* Update Seats Posiston  */}
            <Modal show={updatePositionModal} onHide={() => setUpdatePositionModal(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Sửa vị trí ghế - {DetailsTheater?.TheaterName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Số hàng ghế:</strong></Form.Label>
                        <Form.Control
                            type="number"
                            name="MaxRow"
                            value={updateSeatInfo.MaxRow}
                            onChange={(e) => setUpdateSeatInfo({
                                ...updateSeatInfo,
                                MaxRow: parseInt(e.target.value, 10) || '' // Ép kiểu thành số nguyên, nếu rỗng thì về 0
                            })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label><strong>Số cột ghế:</strong></Form.Label>
                        <Form.Control
                            type="number"
                            name="MaxColumn"
                            value={updateSeatInfo.MaxColumn}
                            onChange={(e) => setUpdateSeatInfo({
                                ...updateSeatInfo,
                                MaxColumn: parseInt(e.target.value, 10) || '' // Ép kiểu thành số nguyên, nếu rỗng thì về 0
                            })}
                        />
                    </Form.Group>

                    <Button onClick={toUpdateSeatsPosiston} variant="dark" className="w-100">
                        Tiếp tục
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Modal Design Update Seat Position */}
            <Modal show={showDesignUpdateSeatsPosition} onHide={() => setshowDesignUpdateSeatsPosition(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Sửa vị trí ghế - {DetailsTheater?.TheaterName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <Button
                                onClick={() => { setshowDesignUpdateSeatsPosition(false); setUpdatePositionModal(true) }}
                                variant="dark"
                            >
                                Quay lại
                            </Button>
                            <Button
                                variant='secondary'
                                onClick={() => updateSeatsPosition()}
                            >
                                Sửa vị trí ghế
                            </Button>
                        </div>
                        <div style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                            {rowNamesUpdate.map((rowName, rowIndex) => {
                                // Tạo danh sách chỗ ngồi của hàng hiện tại
                                const seatColumnMap = Array.from({ length: parseInt(updateSeatInfo.MaxColumn, 10) }).fill(null);

                                insertSeatsData
                                    .filter(seat => seat.Row === rowIndex)
                                    .forEach(seat => {
                                        seatColumnMap[seat.Column] = seat;
                                    });

                                return (
                                    <div key={rowIndex} className="d-flex justify-content-between align-items-center mb-2">
                                        <div style={{ width: "30px", textAlign: "center" }}>{rowName}</div>

                                        <div className="d-flex">
                                            {seatColumnMap.map((seat, columnIndex) => (
                                                <Button
                                                    key={columnIndex}
                                                    variant={seat ? "outline-danger" : "outline-secondary"}
                                                    onClick={() => {
                                                        const seatData = seat || {
                                                            Row: rowIndex,
                                                            Column: columnIndex,
                                                            RowName: rowName,
                                                            Area: 1,
                                                            SeatNumber: parseInt(updateSeatInfo.MaxColumn, 10) - columnIndex
                                                        };
                                                        handleSeatClickDesign(seatData)
                                                    }}
                                                    style={{
                                                        width: "22px",
                                                        height: "22px",
                                                        fontSize: "14px",
                                                        margin: "0 3px",
                                                        padding: "0"
                                                    }}
                                                >
                                                    {seat ? seat.SeatNumber : "+"}
                                                </Button>
                                            ))}
                                        </div>

                                        <div style={{ width: "30px", textAlign: "center" }}>{rowName}</div>
                                    </div>
                                );
                            })}
                            <p className="text-center text-secondary mb-2 mt-4">Màn hình</p>
                            <div className="border border-2 border-secondary mb-2"></div>
                            <div>Lưu ý: thiết kế vị trí ghế ngồi của rạp chiếu để đồng nhất với rạp chiếu đã được xây dựng ở chi nhánh</div>
                        </div>
                    </>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageTheater;
