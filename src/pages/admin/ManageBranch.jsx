import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Modal, Form, Image } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { store } from '../../redux/store';
import { formatDatetime } from '../../lib/utils';
import { useSelector } from 'react-redux';

const ManageBranch = () => {
    const user = useSelector((state) => state.user.currentUser);
    const token = user.token;
    const isAdmin = store.getState().user.currentUser?.user;

    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State modal thêm branch
    const [showAddModal, setShowAddModal] = useState(false);
    const [BranchName, setBranchName] = useState("");
    const [Slug, setSlug] = useState("");
    const [Email, setEmail] = useState("");
    const [Address, setAddress] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [City, setCity] = useState("");
    const [ImageBranch, setImageBranch] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // State modal sửa branch
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    useEffect(() => {
        const getBranches = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/branch/get-all-branch`);
                setBranches(response.data.data);
                setFilteredBranches(response.data.data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách chi nhánh:", err);
                setError("Không thể tải danh sách chi nhánh.");
            } finally {
                setLoading(false);
            }
        };
        getBranches();
    }, []);

    // Tìm kiếm
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

    // Mở modal sửa branch
    const handleShowEditModal = (branch) => {
        setSelectedBranch({ ...branch }); // clone object để chỉnh sửa
        setShowEditModal(true);
    };

    // Hàm cập nhật branch
    const updateBranch = async (branch) => {
        if (!branch.BranchName || !branch.Slug || !branch.Email || !branch.Address || !branch.PhoneNumber || !branch.City) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return false;
        }

        const formData = new FormData();
        formData.append("BranchName", branch.BranchName);
        formData.append("Slug", branch.Slug);
        formData.append("Email", branch.Email);
        formData.append("Address", branch.Address);
        formData.append("PhoneNumber", branch.PhoneNumber);
        formData.append("City", branch.City);
        formData.append("LastUpdatedBy", isAdmin?.Email);

        if (branch.ImageFile) {
            formData.append("ImageURL", branch.ImageFile);
        }

        try {
            await axios.put(
                `${process.env.REACT_APP_API}/branch/update-branch/${branch.BranchID}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            toast.success("Cập nhật chi nhánh thành công!");
            return true;
        } catch (err) {
            console.error("Error updating branch:", err);
            toast.error("Cập nhật chi nhánh thất bại!");
            return false;
        }
    };

    // Thêm branch mới
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
            setShowAddModal(false);

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
            setBranchName(""); setSlug(""); setEmail(""); setAddress(""); setPhoneNumber(""); setCity(""); setImageBranch(null); setPreviewImage(null);

            // Reload danh sách
            const response = await axios.get(`${process.env.REACT_APP_API}/branch/get-all-branch`);
            setBranches(response.data.data || []);
            setFilteredBranches(response.data.data || []);
        } catch (err) {
            console.error("Error adding branch:", err);
            toast.error("Có lỗi xảy ra khi thêm chi nhánh.");
        }
    };

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
                                    label="Tìm kiếm..."
                                    type="search"
                                    variant="standard"
                                    sx={{ width: '300px' }}
                                    size="small"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <Button variant='secondary' onClick={() => setShowAddModal(true)}>Thêm chi nhánh</Button>
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
                                        <TableCell sx={{ color: 'white' }} align="center"><b>Tùy chỉnh</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredBranches.length > 0 ? (
                                        filteredBranches.map(branch => (
                                            <TableRow key={branch.BranchID} hover>
                                                <TableCell>{branch.BranchID}</TableCell>
                                                <TableCell>{branch.BranchName}</TableCell>
                                                <TableCell>{branch.PhoneNumber}</TableCell>
                                                <TableCell>{branch.Email}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Sửa chi nhánh">
                                                        <IconButton color="primary" onClick={() => handleShowEditModal(branch)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">Không có chi nhánh nào được tìm thấy.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                </Row>
            </Container>

            {/* Modal Thêm chi nhánh */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập thông tin chi nhánh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddBranch} encType="multipart/form-data">
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên chi nhánh:</strong></Form.Label>
                            <Form.Control type="text" value={BranchName} onChange={(e) => setBranchName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mã định danh:</strong></Form.Label>
                            <Form.Control type="text" value={Slug} onChange={(e) => setSlug(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Email:</strong></Form.Label>
                            <Form.Control type="text" value={Email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Địa chỉ:</strong></Form.Label>
                            <Form.Control type="text" value={Address} onChange={(e) => setAddress(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Số điện thoại:</strong></Form.Label>
                            <Form.Control type="text" value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Hình ảnh:</strong></Form.Label>
                            <div className="mb-2">
                                {previewImage && <Image src={previewImage} width="100%" alt="Ảnh xem trước" rounded />}
                            </div>
                            <Form.Control type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setPreviewImage(imageUrl);
                                    setImageBranch(file);
                                }
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Thuộc thành phố:</strong></Form.Label>
                            <Form.Control type="text" value={City} onChange={(e) => setCity(e.target.value)} />
                        </Form.Group>
                        <Button type="submit" variant="dark" className="w-100">Thêm chi nhánh</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Sửa chi nhánh */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa chi nhánh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBranch && (
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            const success = await updateBranch(selectedBranch);
                            if (success) {
                                setShowEditModal(false);
                                const response = await axios.get(`${process.env.REACT_APP_API}/branch/get-all-branch`);
                                setBranches(response.data.data || []);
                                setFilteredBranches(response.data.data || []);
                            }
                        }}>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Tên chi nhánh:</strong></Form.Label>
                                <Form.Control type="text" value={selectedBranch.BranchName} onChange={(e) => setSelectedBranch({ ...selectedBranch, BranchName: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Mã định danh:</strong></Form.Label>
                                <Form.Control type="text" value={selectedBranch.Slug} onChange={(e) => setSelectedBranch({ ...selectedBranch, Slug: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Email:</strong></Form.Label>
                                <Form.Control type="text" value={selectedBranch.Email} onChange={(e) => setSelectedBranch({ ...selectedBranch, Email: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Địa chỉ:</strong></Form.Label>
                                <Form.Control type="text" value={selectedBranch.Address} onChange={(e) => setSelectedBranch({ ...selectedBranch, Address: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Số điện thoại:</strong></Form.Label>
                                <Form.Control type="text" value={selectedBranch.PhoneNumber} onChange={(e) => setSelectedBranch({ ...selectedBranch, PhoneNumber: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Hình ảnh:</strong></Form.Label>
                                <div className="mb-2">
                                    <Image src={selectedBranch.ImageURL} width="100%" alt="Ảnh chi nhánh" rounded />
                                </div>
                                <Form.Control type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setSelectedBranch({ ...selectedBranch, ImageURL: imageUrl, ImageFile: file });
                                    }
                                }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Thuộc thành phố:</strong></Form.Label>
                                <Form.Control type="text" value={selectedBranch.City} onChange={(e) => setSelectedBranch({ ...selectedBranch, City: e.target.value })} />
                            </Form.Group>
                            <Button type="submit" variant="dark" className="w-100">Luu thay đổi</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageBranch;
