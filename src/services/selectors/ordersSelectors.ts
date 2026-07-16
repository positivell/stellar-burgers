import { RootState } from '../store';

export const selectOrders = (state: RootState) => state.orders.items;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.orders.orderModalData;

export const selectUserOrderByNumber = (number: number) => (state: RootState) =>
  state.orders.items.find((order) => order.number === number);
