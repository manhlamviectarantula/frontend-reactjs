import { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, ListGroup, Navbar, Row } from 'react-bootstrap'
import Sidebar from '../../components/Sidebar'
import SidebarAdmin from './sidebarAdmin'
import { TextField } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux'
import { getMessageAPI, getUsersSidebarAdmin, sendMessageAPI } from '../../redux/apiCalls'
import { setSelectedUser } from '../../redux/messageRedux'
import { connectSocket, subscribeToMesages, unSubscribeToMesages } from '../../lib/socket'
import { store } from '../../redux/store'

const ChatCSKH = () => {
    const [message, setMessage] = useState("");
    const messageState = useSelector((state) => state.message);

    const chatEndRef = useRef(null);

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    useEffect(() => {
        getUsersSidebarAdmin(dispatch, token)
    }, []);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messageState.messages]);

    const handleSelectUser = (user) => {
        if (!user || !user.AccountID) return;
        if (user.AccountID === messageState.selectedUser?.AccountID) return;

        dispatch(setSelectedUser(user))
        getMessageAPI(dispatch, user.AccountID, token);
    }

    useEffect(() => {
        const init = async () => {
            const user = store.getState().user.currentUser;
            if (!user) return;

            await connectSocket(user.user.AccountID, dispatch); 
            subscribeToMesages(dispatch);
        };

        init();

        return () => {
            unSubscribeToMesages();
        };
    }, [dispatch]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        try {
            await sendMessageAPI(dispatch, messageState.selectedUser?.AccountID, token, message);
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarAdmin} />
                    <Col md={10} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Chat CSKH</h4>
                            <div className='d-flex align-items-center gap-4'>
                                <TextField
                                    label="Tìm kiếm..."
                                    type="search"
                                    variant="standard"
                                    sx={{ width: '210px' }}
                                    size="small"
                                // value={searchTerm}
                                // onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <Row>
                            {!messageState.selectedUser ?
                                <Col md={9}>
                                    <Container style={{ padding: '0px', border: '1.5px solid #212121', borderRadius: '4px' }}>
                                        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
                                            <Container>
                                                <Navbar.Brand href="#">...</Navbar.Brand>
                                            </Container>
                                        </Navbar>

                                        <div className="chat-container">
                                            <div className="chat-box-admin d-flex justify-content-center align-items-center">
                                                <p class="text-secondary">Chọn người muốn chat</p>
                                            </div>
                                        </div>
                                    </Container >
                                </Col>
                                :
                                <Col md={9}>
                                    <Container style={{ padding: '0px', border: '1.5px solid #212121', borderRadius: '4px' }}>
                                        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
                                            <Container>
                                                <Navbar.Brand href="#"> {messageState.selectedUser.Email}</Navbar.Brand>
                                            </Container>
                                        </Navbar>

                                        <div className="chat-container">
                                            <div className="chat-box-admin">
                                                {messageState.messages.map((msg, idx) => (
                                                    <div className={`${msg.SenderID === user.user.AccountID ? "message right" : "message left"}`}>
                                                        <div key={idx} className="message-content">{msg.Text}</div>
                                                    </div>
                                                ))}
                                                <div ref={chatEndRef} />
                                            </div>
                                        </div>

                                        <form onSubmit={handleSendMessage}>
                                            <InputGroup>
                                                <Form.Control
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleSendMessage(e);
                                                    }}
                                                    placeholder="Nhập tin nhắn..."
                                                    aria-label="Recipient's message"
                                                    aria-describedby="button-addon2"
                                                    style={{ boxShadow: 'none', borderRadius: 0 }}
                                                />
                                                <Button
                                                    style={{ borderRadius: 0 }}
                                                    variant="dark"
                                                    type="submit"
                                                    id="button-addon2"
                                                >
                                                    <SendIcon />
                                                </Button>
                                            </InputGroup>
                                        </form>
                                    </Container >
                                </Col>
                            }


                            <Col md={3}>
                                <div style={{ maxHeight: '470px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                                    <ListGroup>
                                        {messageState.users.map((user, idx) => (
                                            <ListGroup.Item key={idx} onClick={() => handleSelectUser(user)} action variant="secondary">{user.Email}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            </Col>

                        </Row>
                    </Col>
                </Row>
            </Container>

            <ToastContainer position="top-right" autoClose={3000} />

        </div>
    )
}

export default ChatCSKH
