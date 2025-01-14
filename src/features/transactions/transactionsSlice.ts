import { LightOrder } from "@airswap/types";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  submitTransaction,
  declineTransaction,
  revertTransaction,
  mineTransaction,
} from "./transactionActions";

export interface SubmittedOrder {
  order: LightOrder;
  hash: string;
  status: "processing" | "succeeded" | "reverted";
}

export interface TransactionsState {
  all: SubmittedOrder[];
}

const initialState: TransactionsState = {
  all: [],
};

function updateTransaction(state: any, action: any, status: string) {
  for (let i in state.all) {
    if (state.all[i].hash === action.payload) {
      state.all[i] = {
        ...state.all[i],
        status,
      };
      break;
    }
  }
}

export const ordersSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clear: (state) => {
      state.all = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitTransaction, (state, action) => {
      state.all.push({
        status: "processing",
        ...action.payload,
      });
    });
    builder.addCase(declineTransaction, (state, action) => {
      console.error(action.payload);
    });
    builder.addCase(revertTransaction, (state, action) => {
      updateTransaction(state, action, "reverted");
    });
    builder.addCase(mineTransaction, (state, action) => {
      updateTransaction(state, action, "succeeded");
    });
  },
});

export const { clear } = ordersSlice.actions;
export const selectTransactions = (state: RootState) => state.transactions.all;
export default ordersSlice.reducer;
