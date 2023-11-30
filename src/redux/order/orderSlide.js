import { BookFilled } from '@ant-design/icons';
import { createSlice } from '@reduxjs/toolkit';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

const initialState = {
    carts: [],
};

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            // console.log("check action; ", action.payload)
            // state.carts.map((obj) => console.log('carts action.payload: ',  { ...obj }));
            const isExistIndex = state.carts.findIndex((product) => product._id === action.payload._id);
            console.log('>>> Check isExistIndex: ', isExistIndex);
            if (isExistIndex > -1) {
                state.carts[isExistIndex].quantity = state.carts[isExistIndex].quantity + action.payload.quantity;
            } else {
                state.carts.push({
                    quantity: action.payload.quantity,
                    _id: action.payload._id,
                    detail: action.payload.detail,
                });
            }
        },
        doUpdateBookAction: (state, action) => {
            const isExistIndex = state.carts.findIndex((product) => product._id === action.payload._id);
            if (isExistIndex > -1) {
                state.carts[isExistIndex].quantity = action.payload.quantity;
                if (state.carts[isExistIndex].quantity > state.carts[isExistIndex].detail.quantity) {
                    state.carts[isExistIndex].quantity = state.carts[isExistIndex].detail.quantity;
                }
            }
        },
        doDeleteItemCartAction: (state, action) => {
            state.carts = state.carts.filter((c) => c._id !== action.payload._id);
        },
    },
});

export const { doAddBookAction, doUpdateBookAction, doDeleteItemCartAction } = orderSlice.actions;
export default orderSlice.reducer;
