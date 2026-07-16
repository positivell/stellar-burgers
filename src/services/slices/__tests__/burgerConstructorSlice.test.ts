import reducer, {
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown,
  resetConstructor
} from '../burgerConstructorSlice';

describe('редьюсер слайса burgerConstructor', () => {
  const ingredientA = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 100,
    image: 'img.png',
    image_large: 'img-large.png',
    image_mobile: 'img-mobile.png',
    id: 'bun-1-id'
  };

  const ingredientB = {
    ...ingredientA,
    _id: 'main-1',
    name: 'Начинка',
    type: 'main',
    price: 80,
    id: 'main-1-id'
  };

  it('возвращает начальное состояние для неизвестного экшена и undefined state', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('обрабатывает экшен addIngredient для булки', () => {
    const state = reducer(
      { bun: null, ingredients: [] },
      addIngredient(ingredientA)
    );

    expect(state).toEqual({ bun: ingredientA, ingredients: [] });
  });

  it('обрабатывает экшен addIngredient для начинки', () => {
    const state = reducer(
      { bun: null, ingredients: [] },
      addIngredient(ingredientB)
    );

    expect(state).toEqual({ bun: null, ingredients: [ingredientB] });
  });

  it('обрабатывает экшен removeIngredient', () => {
    const state = reducer(
      { bun: ingredientA, ingredients: [ingredientB] },
      removeIngredient('main-1-id')
    );

    expect(state).toEqual({ bun: ingredientA, ingredients: [] });
  });

  it('обрабатывает экшен moveUp', () => {
    const first = { ...ingredientB, id: 'first-id' };
    const second = { ...ingredientB, id: 'second-id' };

    const state = reducer(
      { bun: ingredientA, ingredients: [first, second] },
      moveUp('second-id')
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'second-id',
      'first-id'
    ]);
  });

  it('обрабатывает экшен moveDown', () => {
    const first = { ...ingredientB, id: 'first-id' };
    const second = { ...ingredientB, id: 'second-id' };

    const state = reducer(
      { bun: ingredientA, ingredients: [first, second] },
      moveDown('first-id')
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'second-id',
      'first-id'
    ]);
  });

  it('обрабатывает экшен resetConstructor', () => {
    const state = reducer(
      { bun: ingredientA, ingredients: [ingredientB] },
      resetConstructor()
    );

    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
