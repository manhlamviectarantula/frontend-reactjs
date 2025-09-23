import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { resetHold, tick } from "../redux/seatHoldRedux";

const HoldSeats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timeLeft = useSelector((state) => state.seatHold.timeLeft);
  const isHolding = useSelector((state) => state.seatHold.isHolding);
  const lockedSeats = useSelector((state) => state.seatHold.lockedSeats);

  // Giảm thời gian mỗi giây
  useEffect(() => {
    if (!isHolding) return;

    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, isHolding]);

  useEffect(() => {
    if (timeLeft === 0 && isHolding) {
      dispatch(resetHold()); // clear state
      try {
        axios.post(
          `${process.env.REACT_APP_SOCKET_API}/api/v2/showtimeSeats/release-seats`,
          {
            ShowtimeSeatIDs: lockedSeats
          }
        );

        dispatch(resetHold());
        navigate("/"); // quay về trang chủ
      } catch (error) {
        console.error("Lỗi khi mở khóa ghế:", error);
      }
    }
  }, [timeLeft, isHolding, dispatch, navigate]);

  return null; 
};

export default HoldSeats;
