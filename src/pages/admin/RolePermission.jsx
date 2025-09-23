import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';

const RolePermission = () => {
    const accountData = [
        { id: 1, email: "Quản lý chi nhánh", phone: "Thêm suất chiếu" },
        { id: 2, email: "Quản lý chi nhánh", phone: "Thêm rạp chiếu" },
        { id: 3, email: "Quản lý chi nhánh", phone: "Thiết kế rạp chiếu" },
        { id: 4, email: "Thành viên", phone: "Đặt vé" },
        { id: 5, email: "Thành viên", phone: "Sửa thông tin tài khoản" },
    ];
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarAdmin} />

                    <Col md={9} className="p-4 detailAccount">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4 >Danh sách phân quyền</h4>
                            <div >
                                <Button variant="warning">Thêm loại tài khoản</Button>
                                <Button className='ms-2' variant="secondary">Thêm quyền</Button>
                            </div>
                        </div>
                            <Table className="custom-table" striped bordered hover >
                                <thead>
                                    <tr>
                                        <th>Mã phân quyền</th>
                                        <th>Loại tài khoản</th>
                                        <th>Tên quyền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountData.map((account) => (
                                        <tr key={account.id}>
                                            <td>{account.id}</td>
                                            <td>{account.email}</td>
                                            <td>{account.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RolePermission;
