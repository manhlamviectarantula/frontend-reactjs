import io from 'socket.io-client';
import { setOnlineUsers } from '../redux/userRedux';
import { store } from '../redux/store';
import { setNewMessages } from '../redux/messageRedux';

let socket = null;

export const connectSocket = (AccountID = 0, dispatch) => {
  return new Promise((resolve) => {
    if (socket?.connected) return resolve(socket);

    socket = io(process.env.REACT_APP_SOCKET_API, {
      query: { userId: AccountID || 0 }, 
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      resolve(socket);
    });

    socket.on("getOnlineUsers", (userIds) => {
      dispatch(setOnlineUsers(userIds));
    });
  });
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
}

export const subscribeToMesages = (dispatch) => {
  if (!socket) {
    console.warn("⚠️ Socket chưa connect, subscribe bị bỏ qua");
    return;
  }

  socket.on("newMessage", (newMessage) => {
    const state = store.getState();
    const selectedUser = state.message.selectedUser;
    const currentUserId = state.user.currentUser.user.AccountID;

    const isRelevant =
      selectedUser &&
      (
        (newMessage.SenderID === selectedUser.AccountID && newMessage.ReceiverID === currentUserId) ||
        (newMessage.ReceiverID === selectedUser.AccountID && newMessage.SenderID === currentUserId)
      );

    if (isRelevant) {
      dispatch(setNewMessages(newMessage));
    }
  });
};

export const unSubscribeToMesages = () => {
  if (!socket) return;
  socket.off("newMessage")
}

export const subscribeToSeatsLocked = (callback) => {
  socket.on("seatsLocked", callback);
};

export const unSubscribeToSeatsLocked = () => {
  if (!socket) return;
  socket.off("seatsLocked")
}

export const subscribeToSeatsReleased = (callback) => {
  socket.on("seatsReleased", callback);
};

export const unSubscribeToSeatsReleased = () => {
  if (!socket) return;
  socket.off("seatsReleased")
}

export const getSocket = () => socket;