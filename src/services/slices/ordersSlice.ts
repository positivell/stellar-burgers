import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi, orderBurgerApi } from '@api';
import { resetConstructor } from './burgerConstructorSlice';

export type TOrdersState = {
  items: TOrder[];
  loading: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrdersState = {
  items: [],
  loading: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка загрузки заказов'
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredientIds: string[], { dispatch, rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      const createdOrder = response.order as unknown as TOrder;
      dispatch(resetConstructor());
      return createdOrder;
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка оформления заказа'
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<TOrder>) => {
      state.items = [action.payload, ...state.items];
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = null;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, addOrder, closeOrderModal } = ordersSlice.actions;
export default ordersSlice.reducer;
