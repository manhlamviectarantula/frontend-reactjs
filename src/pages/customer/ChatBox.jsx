import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { connectSocket, subscribeToMesages, unSubscribeToMesages } from '../../lib/socket';
import Header from '../../components/Header';
import { Alert, Button, Container, Form, InputGroup, Navbar } from 'react-bootstrap';
import Footer from '../../components/Footer';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { getMessageAPI, sendMessageAPI } from '../../redux/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../redux/messageRedux';
import { store } from '../../redux/store';

function ChatBox() {
  const [message, setMessage] = useState("");
  const messages = useSelector((state) => state.message.messages || []);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const token = user?.token;
  const userToChatID = 1;

  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (userToChatID) getMessageAPI(dispatch, userToChatID, token);
    dispatch(setSelectedUser({ AccountID: userToChatID }))

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
  }, [dispatch, userToChatID, token]);

  useLayoutEffect(() => {
    const container = chatContainerRef.current;

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      return;
    }

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await sendMessageAPI(dispatch, userToChatID, token, message);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <Container style={{ padding: 0, margin: '30px auto', border: '1.5px solid #212121', borderRadius: 4 }}>
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="#"><SupportAgentIcon fontSize="large" /> Nhân viên CSKH</Navbar.Brand>
          </Container>
        </Navbar>

        <div
          className="chat-container"
          ref={chatContainerRef}
        >
          <div className="chat-box">
            {messages.map((msg, idx) => (
              <div key={idx} className={`${msg.SenderID === user?.user?.AccountID ? "message right" : "message left"}`}>
                <div className="message-content">{msg.Text}</div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>
        </div>

        <Alert variant="warning" className='m-0 p-1 text-center'>
          Hãy để lại thắc mắc của bạn. Bộ phận CSKH sẽ phản hồi trong vòng 24h!
        </Alert>

        <form onSubmit={handleSendMessage}>
          <InputGroup>
            <Form.Control
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(e); }}
              placeholder="Nhập tin nhắn..."
              aria-label="Recipient's message"
              aria-describedby="button-addon2"
              style={{ boxShadow: 'none', borderRadius: 0 }}
            />
            <Button style={{ borderRadius: 0 }} variant="dark" type="submit" id="button-addon2">
              <SendIcon />
            </Button>
          </InputGroup>
        </form>
      </Container>
      <Footer />
    </>
  );
}

export default ChatBox;
