import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients.push(ingredient);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveUp: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.ingredients.findIndex((it) => it.id === id);
      if (idx > 0) {
        const tmp = state.ingredients[idx - 1];
        state.ingredients[idx - 1] = state.ingredients[idx];
        state.ingredients[idx] = tmp;
      }
    },
    moveDown: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.ingredients.findIndex((it) => it.id === id);
      if (idx >= 0 && idx < state.ingredients.length - 1) {
        const tmp = state.ingredients[idx + 1];
        state.ingredients[idx + 1] = state.ingredients[idx];
        state.ingredients[idx] = tmp;
      }
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const addIngredient = burgerConstructorSlice.actions.addIngredient;
export const removeIngredient = burgerConstructorSlice.actions.removeIngredient;
export const moveUp = burgerConstructorSlice.actions.moveUp;
export const moveDown = burgerConstructorSlice.actions.moveDown;
export const resetConstructor = burgerConstructorSlice.actions.resetConstructor;
export default burgerConstructorSlice.reducer;
