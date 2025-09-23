import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Modal, Form, Image } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { store } from '../../redux/store';
import { formatDatetime } from '../../lib/utils';
import { useSelector } from 'react-redux';

const ManageBranch = () => {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [BranchName, setBranchName] = useState("");
    const [Slug, setSlug] = useState("")
    const [Email, setEmail] = useState("")
    const [Address, setAddress] = useState("")
    const [PhoneNumber, setPhoneNumber] = useState("")
    const [City, setCity] = useState("")
    const [ImageBranch, setImageBranch] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const isAdmin = store.getState().user.currentUser?.user;

    const [showAddModal, setShowAddModal] = useState(false);

    const addBranchClick = () => {
        setShowAddModal(true);
    }

    // State cho Deatails Modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    useEffect(() => {
        const getBranches = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/branch/get-all-branch`);
                setBranches(response.data.data);
                setFilteredBranches(response.data.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách chi nhánh:', error);
                setError("Không thể tải danh sách chi nhánh.");
            } finally {
                setLoading(false);
            }
        };

        getBranches();
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredBranches(
            branches.filter(branch =>
                branch.BranchName.toLowerCase().includes(value) ||
                branch.Email.toLowerCase().includes(value) ||
                branch.PhoneNumber.includes(value)
            )
        );
    };

    // Mở modal chi tiết chi nhánh
    const handleShowDetailsModal = (branch) => {
        setSelectedBranch(branch);
        setShowDetailsModal(true);
    };

    const handleAddBranch = async (e) => {
        e.preventDefault();

        if (!BranchName || !Slug || !Email || !Address || !PhoneNumber || !City || !isAdmin?.Email) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const formData = new FormData();
        formData.append("BranchName", BranchName);
        formData.append("Slug", Slug);
        formData.append("Email", Email);
        formData.append("Address", Address);
        formData.append("PhoneNumber", PhoneNumber);
        formData.append("City", City);
        formData.append("ImageURL", ImageBranch);
        formData.append("CreatedBy", isAdmin.Email);
        formData.append("LastUpdatedBy", isAdmin.Email);

        try {
            await axios.post(
                `${process.env.REACT_APP_API}/branch/add-branch`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            toast.success("Thêm chi nhánh thành công!");

            // Đặt lại giá trị của state về rỗng
            setBranchName("");
            setSlug("");
            setEmail("");
            setAddress("");
            setPhoneNumber("");
            setCity("");
            setImageBranch(null);
            setPreviewImage(null);
            setShowAddModal(false);

            // Cập nhật danh sách chi nhánh
            const response = await axios.get(`${process.env.REACT_APP_API}/branch/get-all-branch`);
            setBranches(response.data.data || []);
            setFilteredBranches(response.data.data);
        } catch (error) {
            console.error("Error adding branch:", error);
            toast.error("Có lỗi xảy ra khi thêm chi nhánh.");
        }
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarAdmin} />

                    <Col md={10} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Danh sách chi nhánh</h4>
                            <div className='d-flex align-items-center gap-4'>
                                <TextField
                                    id="standard-search"
                                    label="Tìm kiếm..."
                                    type="search"
                                    variant="standard"
                                    sx={{ width: '300px' }}
                                    size="small"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <Button variant='secondary' onClick={addBranchClick}>Thêm chi nhánh</Button>
                            </div>
                        </div>
                        <TableContainer component={Paper} elevation={3}>
                            <Table size="small" aria-label="Danh sách chi nhánh" sx={{ borderCollapse: 'collapse' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#2c3034' }}>
                                        <TableCell sx={{ color: 'white' }}><b>ID</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Tên chi nhánh</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Số điện thoại</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Email</b></TableCell>
                                        <TableCell sx={{ color: 'white' }} align="center"><b>Xem chi tiết</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredBranches.length > 0 ? (
                                        filteredBranches.map((branch) => (
                                            <TableRow key={branch.BranchID} hover>
                                                <TableCell>{branch.BranchID}</TableCell>
                                                <TableCell>{branch.BranchName}</TableCell>
                                                <TableCell>{branch.PhoneNumber}</TableCell>
                                                <TableCell>{branch.Email}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleShowDetailsModal(branch)}
                                                        >
                                                            <KeyboardDoubleArrowRightIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                Không có chi nhánh nào được tìm thấy.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Col>
                </Row>
            </Container>

            {/* Modal hiển thị chi tiết chi nhánh */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi Tiết Chi Nhánh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBranch && (
                        <div>
                            <p><strong>ID:</strong> {selectedBranch.BranchID}</p>
                            <p><strong>Tên chi nhánh:</strong> {selectedBranch.BranchName}</p>
                            <p><strong>Mã định danh:</strong> {selectedBranch.Slug}</p>
                            <p><strong>Số điện thoại:</strong> {selectedBranch.PhoneNumber}</p>
                            <p><strong>Email:</strong> {selectedBranch.Email}</p>
                            <p><strong>Địa chỉ:</strong> {selectedBranch.Address}</p>
                            <p className='mb-1'><strong>Hình ảnh:</strong> </p>
                            <Image
                                src={`${process.env.REACT_APP_API}/${selectedBranch.ImageURL}`}
                                width="100%"
                                alt="Ảnh chi nhánh"
                                rounded
                            />
                            <p className='mt-3'><strong>Thuộc Thành phố:</strong> {selectedBranch.City}</p>
                            <p><strong>Ngày tạo:</strong> {formatDatetime(selectedBranch.CreatedAt)}</p>
                            <p><strong>Lần sửa cuối cùng:</strong> {formatDatetime(selectedBranch.LastUpdatedAt)}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Add Branch */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập thông tin chi nhánh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddBranch} encType="multipart/form-data">
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên chi nhánh:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='BranchName'
                                value={BranchName}
                                onChange={(e) => setBranchName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mã định danh:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='Slug'
                                value={Slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Email:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='Email'
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Địa chỉ:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='Address'
                                value={Address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Số điện thoại:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='PhoneNumber'
                                value={PhoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Hình ảnh:</strong></Form.Label>
                            <div className="mb-2">
                                {previewImage && (
                                    <Image
                                        src={previewImage}
                                        width="100%"
                                        alt="Ảnh xem trước"
                                        rounded
                                    />
                                )}
                            </div>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                name='Image'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setPreviewImage(imageUrl);
                                        setImageBranch(file)
                                    }
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Thuộc thành phố:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='City'
                                value={City}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </Form.Group>

                        {/* Khi bấm nút này sẽ mở modal xác nhận */}
                        <Button type="submit" variant="dark" className="w-100">
                            Thêm chi nhánh
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer position="top-right" autoClose={3000} />

        </div>
    );
};

export default ManageBranch;
