import reducer, {
  fetchIngredients,
  TIngredientsState,
  clearError
} from '../ingredientsSlice';

describe('редьюсер слайса ingredients', () => {
  const initialState: TIngredientsState = {
    items: [],
    loading: false,
    error: null
  };

  it('возвращает начальное состояние для неизвестного экшена и undefined state', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('обрабатывает экшен clearError', () => {
    const previousState: TIngredientsState = {
      items: [],
      loading: true,
      error: 'Ошибка'
    };

    expect(reducer(previousState, clearError())).toEqual({
      ...previousState,
      error: null
    });
  });

  it('обрабатывает экшен fetchIngredients.pending', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('обрабатывает экшен fetchIngredients.fulfilled', () => {
    const payload = [
      {
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
        image_mobile: 'img-mobile.png'
      }
    ];

    const state = reducer(
      { ...initialState, loading: true },
      { type: fetchIngredients.fulfilled.type, payload }
    );

    expect(state).toEqual({
      items: payload,
      loading: false,
      error: null
    });
  });

  it('обрабатывает экшен fetchIngredients.rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      { type: fetchIngredients.rejected.type, payload: 'Ошибка загрузки' }
    );

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка загрузки'
    });
  });
});
