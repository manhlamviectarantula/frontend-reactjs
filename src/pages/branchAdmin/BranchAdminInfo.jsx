import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Image, Modal } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import SidebarBranchAdmin from "./sidebarBranchAdmin";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import slugify from "slugify";

const BranchAdminInfo = () => {
    const user = useSelector((state) => state.user.currentUser);
    const token = user?.token;
    const branchID = user?.user?.BranchID || "";

    const [branch, setBranch] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        BranchName: "",
        Slug: "",
        Email: "",
        Address: "",
        PhoneNumber: "",
        City: "",
        LastUpdatedBy: user?.user?.FullName || "",
        ImageURL: null,
    });

    useEffect(() => {
        if (!branchID) return;
        const fetchBranch = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API}/branch/get-details-branch/${branchID}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setBranch(res.data.data);
                setFormData({
                    BranchName: res.data.data.BranchName || "",
                    Slug: res.data.data.Slug || "",
                    Email: res.data.data.Email || "",
                    Address: res.data.data.Address || "",
                    PhoneNumber: res.data.data.PhoneNumber || "",
                    City: res.data.data.City || "",
                    LastUpdatedBy: user?.user?.FullName || "",
                    ImageURL: null,
                });
            } catch {
                toast.error("Không thể tải thông tin chi nhánh!");
            }
        };
        fetchBranch();
    }, [branchID, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "BranchName") {
            const generatedSlug = slugify(value, {
                lower: true,
                strict: true, // loại bỏ ký tự đặc biệt
                locale: "vi", // hỗ trợ tiếng Việt
            });
            setFormData((prev) => ({
                ...prev,
                BranchName: value,
                Slug: generatedSlug,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, ImageURL: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            if (formData[key]) data.append(key, formData[key]);
        }

        try {
            await axios.put(
                `${process.env.REACT_APP_API}/branch/update-branch/${branchID}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success("Cập nhật chi nhánh thành công!");
        } catch {
            toast.error("Cập nhật thất bại!");
        }
    };

    const [showChangePassword, setShowChangePassword] = useState(false);
    const handleShowChangePassword = () => setShowChangePassword(true);
    const handleCloseChangePassword = () => setShowChangePassword(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [cNewPassword, setCNewPassword] = useState('');

    const UpdatePW = (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !cNewPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (newPassword !== cNewPassword) {
            toast.error("Nhập lại mật khẩu mới chưa đúng!")
            return;
        }

        axios
            .put(`${process.env.REACT_APP_API}/account/update-pw/${user?.user?.AccountID}`, {
                currentPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                toast.success("Đổi mật khẩu thành công!")
                handleCloseChangePassword()
                setCurrentPassword('')
                setNewPassword('')
                setCNewPassword('')
            })
            .catch((err) => {
                toast.error(err.response.data.error)
            });
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: "100%" }}>
                    <Sidebar links={SidebarBranchAdmin} />

                    <Col md={10} className="p-4">
                        <h4 className="mb-4">Thông tin chi nhánh:</h4>

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên chi nhánh</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="BranchName"
                                            value={formData.BranchName}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Slug</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Slug"
                                            value={formData.Slug}
                                            readOnly
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="Email"
                                            value={formData.Email}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="PhoneNumber"
                                            value={formData.PhoneNumber}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Địa chỉ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Address"
                                            value={formData.Address}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Thành phố</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="City"
                                            value={formData.City}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Ảnh chi nhánh</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {(previewImage || branch?.ImageURL) && (
                                            <div className="mt-2">
                                                <Image
                                                    src={previewImage || branch?.ImageURL}
                                                    thumbnail
                                                    width={200}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="mt-3 text-end">
                                <Button type="submit" variant="dark">
                                    Lưu thay đổi
                                </Button>
                            </div>

                            <h4 className="mb-4">Tài khoản quản lí:</h4>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="BranchName"
                                            value={user.user.Email}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Button onClick={handleShowChangePassword} variant="dark">
                                        Đổi mật khẩu
                                    </Button>
                                </Col>
                            </Row>

                        </Form>
                    </Col>
                </Row>
            </Container>

            <Modal show={showChangePassword} onHide={handleCloseChangePassword} centered>
                <Modal.Header closeButton>
                    <img
                        src={`https://res.cloudinary.com/dnpo0jukc/image/upload/v1759719075/Designer-Photoroom_rrk4es.png`}
                        alt="Cinema logo - homepage"
                        height="40"
                    />
                    <Modal.Title className='ms-3'>Đổi Mật Khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body closeButton>
                    <Form onSubmit={UpdatePW}>
                        <Form.Group className="mb-3" controlId="oldPassword">
                            <Form.Label>Mật khẩu hiện tại</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="confirmNewPassword">
                            <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                value={cNewPassword}
                                onChange={(e) => setCNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            type='submit'
                            style={{ border: 'none', background: '#212529' }}
                            className="w-100 py-2 mt-2"
                            size="sm"
                        >
                            Lưu thay đổi
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default BranchAdminInfo;
