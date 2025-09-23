import { useState, useEffect, useRef } from "react";
import { Button, Container, Form, InputGroup, Navbar } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ChatBot() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const user = useSelector((state) => state.user.currentUser)
    const token = user.token
    const userId = user.user.AccountID;

    // gọi API khởi tạo
    useEffect(() => {
        axios
            .post(
                `${process.env.REACT_APP_API}/chatbot/classic`,
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                setMessages([
                    { from: "bot", text: res.data.reply, buttons: res.data.buttons || [] },
                ]);
                if (res.data.menu) setMenu(res.data.menu);
            })
            .catch((err) => console.error(err));
    }, [token, userId]);

    // auto scroll
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const newUserMsg = { from: "user", text: message };
        setMessages((prev) => [...prev, newUserMsg]);
        setMessage("");
        setLoading(true);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API}/chatbot/ai`,
                {
                    messages: [
                        ...messages.map((m) => ({
                            role: m.from === "user" ? "user" : "assistant",
                            content: m.text,
                        })),
                        { role: "user", content: message },
                    ],
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: res.data.reply },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: "❌ Lỗi: không kết nối được server" },
            ]);
        }
        setLoading(false);
    };

    const handleMenuClick = async (option) => {
        setMessages((prev) => [...prev, { from: "user", text: option }]);
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API}/chatbot/classic`,
                { action: option, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: res.data.reply, buttons: res.data.buttons || [] },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: "❌ Lỗi: không kết nối được server" },
            ]);
        }
        setLoading(false);
    };

    return (
        <>
            {/* ✅ Bubble cố định */}
            <div
                style={{
                    position: "fixed",
                    bottom: 40,
                    right: 30,
                    zIndex: 9999,
                }}
            >
                {!isOpen ? (
                    // Nút bóng chat
                    <Button
                        variant="dark"
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        }}
                        onClick={() => setIsOpen(true)}
                    >
                        <SmartToyIcon fontSize="large" />
                    </Button>
                ) : (
                    // Khung chat
                    <Container
                        style={{
                            width: 350,
                            height: 500,
                            border: "1.5px solid #212121",
                            borderRadius: 8,
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                            padding: 0
                        }}
                    >
                        <Navbar expand="lg" bg="dark" data-bs-theme="dark" style={{ borderRadius: "8px 8px 0 0" }}>
                            <Container fluid>
                                <Navbar.Brand style={{ color: "#fff" }}>
                                    <SmartToyIcon /> Chatbot x AI
                                </Navbar.Brand>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    ✖
                                </Button>
                            </Container>
                        </Navbar>

                        {/* Chat history */}
                        <div
                            ref={chatContainerRef}
                            style={{
                                flex: 1,
                                padding: 12,
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                                        backgroundColor: msg.from === "user" ? "#212121" : "#f1f1f1",
                                        color: msg.from === "user" ? "#fff" : "#000",
                                        padding: "8px 12px",
                                        borderRadius: 12,
                                        maxWidth: "75%",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {msg.text}
                                    {msg.buttons && msg.buttons.length > 0 && (
                                        <div style={{ marginTop: 5, width: "100%", display: "flex", flexDirection: "column", gap: "5px" }}>
                                            {msg.buttons.map((btn, i) => (
                                                <Button
                                                    key={i}
                                                    variant="outline-dark"
                                                    size="sm"
                                                    style={{ width: "100%" }} 
                                                    onClick={() => {
                                                        if (btn.url.startsWith("http")) {
                                                            window.open(btn.url, "_blank");
                                                        } else {
                                                            navigate(btn.url);
                                                        }
                                                    }}
                                                >
                                                    {btn.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div
                                    style={{
                                        alignSelf: "flex-start",
                                        backgroundColor: "#f1f1f1",
                                        padding: "8px 12px",
                                        borderRadius: 12,
                                        maxWidth: "75%",
                                    }}
                                >
                                    ⏳ AI đang trả lời...
                                </div>
                            )}
                        </div>

                        {/* Menu + Input */}
                        <form onSubmit={handleSendMessage}>
                            {menu.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        overflowX: "auto", // ✅ Kéo ngang
                                        gap: "8px",
                                        padding: "8px",
                                        borderTop: "1px solid #ddd",
                                        background: "#f9f9f9",
                                        whiteSpace: "nowrap", // ✅ Không xuống dòng
                                    }}
                                >
                                    {menu.map((item, i) => (
                                        <Button
                                            key={i}
                                            variant="outline-dark"
                                            size="sm"
                                            style={{ flex: "0 0 auto" }} // ✅ Giữ đúng kích thước
                                            onClick={() => handleMenuClick(item)}
                                        >
                                            {item}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            <InputGroup>
                                <Form.Control
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn..."
                                    style={{ boxShadow: "none", borderRadius: 0 }}
                                />
                                <Button
                                    style={{ borderRadius: 0 }}
                                    variant="dark"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <SendIcon />
                                </Button>
                            </InputGroup>
                        </form>
                    </Container>
                )}
            </div>
        </>
    );
}

export default ChatBot;