import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        ShowtimeInfoDisplay: {
            MovieName: "",
            Poster: "",
            Duration: "",
            AgeTag: "",
            BranchID: null,
            BranchName: "",
            TheaterName: "",
            StartTime: "",
            ShowDate: "",
        },
        ShowtimeInfoOrder: {
            ShowtimeID: null,
        },
        selectedSeats: [],
        orderFoods: []
    },
    reducers: {
        addSeat: (state, action) => {
            state.selectedSeats = action.payload;
        },
        addShowtimeInfoDisplay: (state, action) => {
            state.ShowtimeInfoDisplay.MovieName = action.payload.MovieName
            state.ShowtimeInfoDisplay.Poster = action.payload.Poster
            state.ShowtimeInfoDisplay.Duration = action.payload.Duration
            state.ShowtimeInfoDisplay.AgeTag = action.payload.AgeTag
            state.ShowtimeInfoDisplay.BranchID = action.payload.BranchID
            state.ShowtimeInfoDisplay.BranchName = action.payload.BranchName
            state.ShowtimeInfoDisplay.TheaterName = action.payload.TheaterName
            state.ShowtimeInfoDisplay.StartTime = action.payload.StartTime
            state.ShowtimeInfoDisplay.ShowDate = action.payload.ShowDate
        },
        addShowtimeInfoOrder: (state, action) => {
            state.ShowtimeInfoOrder.ShowtimeID = action.payload.ShowtimeID
        },
        addOrderFoods: (state, action) => {
            const food = action.payload;
            const existingFoodIndex = state.orderFoods.findIndex(item => item.FoodID === food.FoodID);

            if (existingFoodIndex !== -1) {
                state.orderFoods[existingFoodIndex].quantity += 1;
                state.orderFoods[existingFoodIndex].TotalPrice =
                    state.orderFoods[existingFoodIndex].Price * state.orderFoods[existingFoodIndex].quantity;
            } else {
                state.orderFoods.push({ ...food, quantity: 1, TotalPrice: food.Price });
            }
        },
        decreaseOrderFood: (state, action) => {
            const food = action.payload;
            const existingFoodIndex = state.orderFoods.findIndex(item => item.FoodID === food.FoodID);

            if (existingFoodIndex !== -1) {
                if (state.orderFoods[existingFoodIndex].quantity > 1) {
                    state.orderFoods[existingFoodIndex].quantity -= 1;
                    state.orderFoods[existingFoodIndex].TotalPrice =
                        state.orderFoods[existingFoodIndex].Price * state.orderFoods[existingFoodIndex].quantity;
                } else {
                    state.orderFoods.splice(existingFoodIndex, 1);
                }
            }
        },
        resetOrder: (state) => {
            state.ShowtimeInfo = {
                MovieName: "",
                Poster: "",
                Duration: "",
                AgeTag: "",
                BranchID: null,
                BranchName: "",
                TheaterName: "",
                StartTime: "",
                ShowDate: "",
            };
            state.selectedSeats = [];
            state.orderFoods = [];
        }
    }
})

export const { addSeat, addShowtimeInfoDisplay, addShowtimeInfoOrder, addOrderFoods, decreaseOrderFood, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;