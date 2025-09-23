import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';

const MomoResult = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [params] = useSearchParams();

    useEffect(() => {
        const resultCode = params.get("resultCode");
        const extraData = params.get("extraData");

        if (resultCode === "0" && extraData) {
            try {

                const decodedStr = decodeURIComponent(escape(atob(extraData)));
                const parsed = JSON.parse(decodedStr);

                axios.post(`${process.env.REACT_APP_API}/order/create-after-payment`, parsed)
                    .then(() => setStatus("success"))
                    .catch(() => setStatus("fail"));
            } catch (error) {
                console.error("Failed to parse extraData", error);
                setStatus("fail");
            }
        } else {
            setStatus("fail");
        }
    }, [params]);

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container className="my-5 text-center">
            {status === 'loading' && (
                <div>
                    <Spinner animation="border" />
                    <p>Đang xử lý kết quả thanh toán...</p>
                </div>
            )}

            {status === 'success' && (
                <>
                    <Alert variant="success">
                        <h4>Thanh toán thành công!</h4>
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của CINÉMÀ. Truy cập Email hoặc Lịch sử giao dịch để nhận vé.</p>
                    </Alert>
                    <Button variant="dark" onClick={handleGoHome}>Về trang chủ</Button>
                </>
            )}

            {status === 'fail' && (
                <>
                    <Alert variant="danger">
                        <h4>Thanh toán MOMO thất bại hoặc có lỗi!</h4>
                        <p>Vui lòng thử lại hoặc chọn phương thức khác.</p>
                    </Alert>
                    <Button variant="secondary" onClick={handleGoHome}>Về trang chủ</Button>
                </>
            )}
        </Container>
    );
};

export default MomoResult;
