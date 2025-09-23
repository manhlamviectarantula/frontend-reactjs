import { useSelector } from "react-redux";

const HoldSeatsTimer = () => {
  const timeLeft = useSelector((state) => state.seatHold.timeLeft);
  const isHolding = useSelector((state) => state.seatHold.isHolding);

  if (!isHolding) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return <div style={{ fontSize: "20px", textAlign: "center", marginBottom: "10px" }}>
    Thời gian giữ ghế: {formatTime(timeLeft)}
  </div>;
};

export default HoldSeatsTimer;
