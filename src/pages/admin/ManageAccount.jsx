import { useEffect, useState, useCallback } from 'react';
import { Button, Col, Container, Row, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';
import axios from 'axios';
import { ArrowDropDownCircle, KeyboardDoubleArrowRight, Lock, LockOpen } from '@mui/icons-material';
import { formatDate, formatDatetime } from '../../lib/utils';
import { useSelector } from 'react-redux';

const ManageAccount = () => {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showDowngradeModal, setShowDowngradeModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState("");
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedAccountType, setSelectedAccountType] = useState(2); // mặc định nâng cấp thành quản lý chi nhánh

    const getAccounts = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/account/get-all-accounts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAccounts(response.data.data);
            setFilteredAccounts(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tài khoản:', error);
        }
    }, []);

    useEffect(() => {
        getAccounts();
    }, [getAccounts]);

    useEffect(() => {
        const filtered = accounts.filter(account =>
            account.Email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAccounts(filtered);
    }, [searchTerm, accounts]);

    const handleShowDetails = (account) => {
        setSelectedAccount(account);
        setShowDetailsModal(true);
    };

    const handleOpenConfirmModal = (account) => {
        setSelectedAccount(account);
        setActionType(account.Status === 1 ? "lock" : "unlock");
        setShowConfirmModal(true);
    };

    const handleBlockAccount = async () => {
        if (!selectedAccount) return;
        setLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_API}/account/change-account-status/${selectedAccount.AccountID}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await getAccounts();
            setShowConfirmModal(false);
            setShowDetailsModal(false);
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái tài khoản:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenUpgradeOrDowngradeModal = async (account) => {
        setSelectedAccount(account);
        if (account.AccountTypeID === 2) {
            // Nếu là quản lý chi nhánh => hạ cấp
            setShowDowngradeModal(true);
        } else {
            // Nếu là user thường => nâng cấp
            setShowUpgradeModal(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/branch/get-all-branch`);
                setBranches(response.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chi nhánh:", error);
            }
        }
    };

    const handleUpgradeAccount = async () => {
        if (!selectedAccount || !selectedBranch) return;
        setLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_API}/account/upgrade-account/${selectedAccount.AccountID}`, {
                AccountID: selectedAccount.AccountID,
                BranchID: parseInt(selectedBranch),
                AccountTypeID: selectedAccountType,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            await getAccounts();
            setShowUpgradeModal(false);
        } catch (error) {
            console.error("Lỗi khi nâng cấp tài khoản:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDowngradeAccount = async () => {
        if (!selectedAccount) return;
        setLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_API}/account/downgrade-account`, {
                AccountID: selectedAccount.AccountID,
                AccountTypeID: 1, // user thường
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await getAccounts();
            setShowDowngradeModal(false);
        } catch (error) {
            console.error("Lỗi khi hạ cấp tài khoản:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarAdmin} />
                    <Col md={10} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Danh sách tài khoản</h4>
                            <TextField
                                id="standard-search"
                                label="Tìm kiếm..."
                                type="search"
                                variant="standard"
                                sx={{ width: '300px' }}
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <TableContainer component={Paper} elevation={3} >
                            <Table size="small" aria-label="Danh sách tài khoản" sx={{ borderCollapse: 'collapse' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#2c3034' }}>
                                        <TableCell sx={{ color: 'white' }}><b>ID</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Email</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Trạng thái</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Loại tài khoản</b></TableCell>
                                        <TableCell sx={{ color: 'white' }} align="center" colSpan={3}><b>Tùy chỉnh</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAccounts.length > 0 ? (
                                        filteredAccounts.map((account) => (
                                            <TableRow key={account.AccountID} hover>
                                                <TableCell>{account.AccountID}</TableCell>
                                                <TableCell>{account.Email}</TableCell>
                                                <TableCell sx={{ color: account.Status === 1 ? "green" : "red" }}>
                                                    {account.Status === 1 ? "Hoạt động" : "Đang khóa"}
                                                </TableCell>
                                                <TableCell>{account.AccountTypeName}</TableCell>

                                                <TableCell align="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton color="primary" onClick={() => handleShowDetails(account)}>
                                                            <KeyboardDoubleArrowRight fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Tooltip title={account.Status === 1 ? "Khóa tài khoản" : "Mở khóa tài khoản"}>
                                                        <IconButton
                                                            color={account.Status === 1 ? "error" : "success"}
                                                            onClick={() => handleOpenConfirmModal(account)}
                                                            disabled={loading}
                                                        >
                                                            {account.Status === 1 ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Tooltip title={account.AccountTypeID === 2 ? "Hạ cấp tài khoản" : "Nâng cấp tài khoản"}>
                                                        <IconButton color="default" onClick={() => handleOpenUpgradeOrDowngradeModal(account)}>
                                                            <ArrowDropDownCircle fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Không có tài khoản nào được tìm thấy.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                </Row>
            </Container>

            {/* Modal hiển thị chi tiết */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAccount && (
                        <div>
                            <p><strong>ID:</strong> {selectedAccount.AccountID}</p>
                            <p><strong>Email:</strong> {selectedAccount.Email}</p>
                            <p><strong>Số điện thoại:</strong> {selectedAccount.PhoneNumber}</p>
                            <p><strong>Họ tên:</strong> {selectedAccount.FullName}</p>
                            <p><strong>Ngày sinh:</strong> {formatDate(selectedAccount.BirthDate)}</p>
                            <p><strong>Loại tài khoản:</strong> {selectedAccount.AccountTypeName}</p>
                            <p><strong>Chi nhánh quản lí:</strong> {selectedAccount.BranchName}</p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <span style={{ color: selectedAccount.Status === 1 ? "green" : "red" }}>
                                    {selectedAccount.Status === 1 ? " Hoạt động" : " Đang khóa"}
                                </span>
                            </p>
                            <p><strong>Lần sửa cuối:</strong> {formatDatetime(selectedAccount.LastUpdatedAt)}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận khóa/mở khóa */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAccount && (
                        <p>
                            {actionType === "lock" ? "Bạn có chắc chắn muốn khóa tài khoản này?" : "Bạn có chắc chắn muốn mở khóa tài khoản này?"}
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
                    <Button
                        variant={actionType === "lock" ? "danger" : "success"}
                        onClick={handleBlockAccount}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : actionType === "lock" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal nâng cấp */}
            <Modal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nâng cấp tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Chọn chi nhánh để nâng cấp tài khoản thành quản lý chi nhánh:</p>
                    <select
                        className="form-select"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="">-- Chọn chi nhánh --</option>
                        {branches.map(branch => (
                            <option key={branch.BranchID} value={branch.BranchID}>
                                {branch.BranchName}
                            </option>
                        ))}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleUpgradeAccount} disabled={loading || !selectedBranch}>
                        {loading ? "Đang xử lý..." : "Xác nhận nâng cấp"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal hạ cấp */}
            <Modal show={showDowngradeModal} onHide={() => setShowDowngradeModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Hạ cấp tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAccount && (
                        <>
                            <p><strong>Email:</strong> {selectedAccount.Email}</p>
                            <p>Bạn có chắc muốn hạ cấp tài khoản này thành tài khoản thường?</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDowngradeModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDowngradeAccount} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Xác nhận hạ cấp"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageAccount;
