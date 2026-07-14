export {
  fetchIngredients,
  clearError as clearIngredientsError
} from './ingredientsSlice';
export { fetchFeeds, clearError as clearFeedsError } from './feedSlice';
export {
  fetchOrders,
  createOrder,
  closeOrderModal,
  clearError as clearOrdersError
} from './ordersSlice';
export {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  updateUser,
  setUser,
  setAuthChecked,
  clearUser
} from './userSlice';
import * as burgerConstructor from './burgerConstructorSlice';

export const addIngredient = burgerConstructor.addIngredient;
export const removeIngredient = burgerConstructor.removeIngredient;
export const moveUp = burgerConstructor.moveUp;
export const moveDown = burgerConstructor.moveDown;
export const resetConstructor = burgerConstructor.resetConstructor;
