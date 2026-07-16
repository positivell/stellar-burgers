import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.orders.items);
  const ingredients = useSelector((state) => state.ingredients.items);
  const [orderData, setOrderData] = useState<TOrder | null>(null);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (!number) {
      return;
    }

    const orderNumber = Number(number);
    const existingOrder = [...feedOrders, ...profileOrders].find(
      (item) => item.number === orderNumber
    );

    if (existingOrder) {
      setOrderData(existingOrder);
      return;
    }

    let isMounted = true;

    getOrderByNumberApi(orderNumber)
      .then((response) => {
        if (isMounted) {
          setOrderData(response.orders[0] || null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOrderData(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [feedOrders, number, profileOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [ingredients, orderData]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
