// PaymentMethod.jsx
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const paymentMethods = [
  { label: "MOMO", value: "MOMO", img: "https://res.cloudinary.com/dnpo0jukc/image/upload/v1758733095/logomomo_t344kh.png" },
  { label: "VNPay", value: "VNPAY", img: "https://res.cloudinary.com/dnpo0jukc/image/upload/v1758733101/logovnpay_uliy79.png" },
  { label: "Zalopay", value: "Zalopay", img: "https://res.cloudinary.com/dnpo0jukc/image/upload/v1758733102/logozalopay_ttfoyi.png" },
  { label: "ShopeePay", value: "SHOPEEPAY", img: "https://res.cloudinary.com/dnpo0jukc/image/upload/v1758733101/logoshopeepay_hxp2uh.png" },
];

const PaymentMethod = ({ selectedMethod, setSelectedMethod, handleCheckout }) => {
  const handleRadioChange = (e) => setSelectedMethod(e.target.value);

  return (
    <div>
      <h6 style={{ marginBottom: "25px" }}>Chọn phương thức thanh toán:</h6>

      {paymentMethods.map((method) => (
        <Form.Check
          key={method.value}
          style={{ marginBottom: "15px" }}
          type="radio"
          label={
            <div className="d-flex align-items-center">
              <img
                src={`${method.img}`}
                alt={method.label}
                style={{ width: 30, marginRight: 10 }}
              />
              {method.label}
            </div>
          }
          value={method.value}
          checked={selectedMethod === method.value}
          onChange={handleRadioChange}
        />
      ))}

      <Button
        variant="dark"
        style={{ width: "100%", marginTop: "auto" }}
        onClick={() => {
          if (selectedMethod === "MOMO") {
            handleCheckout();
          } else {
            toast.warning("Phương thức đang được phát triển!");
          }
        }}
      >
        Thanh toán
      </Button>
    </div>
  );
};

export default PaymentMethod;
