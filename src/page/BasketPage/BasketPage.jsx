import React, {useState} from 'react';
import BasketItem from "../../components/BasketItem/BasketItem";
import './BasketPage.scss'
import {useDispatch, useSelector} from "react-redux";
import {deleteAll} from "../../redux/slices/userSlice";
import Modal from "../../components/Modal/Modal";
import {useEffect} from "react";

const BasketPage = () => {
    const [active, setActive] = useState(false);
    const basket = useSelector(state => state.user.basket)
    const totalPrice = useSelector(state => state.user.totalPrice)
    const dispatch = useDispatch();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className='basket_wrapper'>
            <h1 className='bas'>Моя корзина</h1>
            {basket.length < 1
                ?
                <div>
                    <h4 className='bas'>Ваша корзина пустая :(</h4>
                </div>
                :
                <div>
                    <div className='clear_button'>
                        <button
                            className='clear_button_btn'
                            onClick={() => dispatch(deleteAll())}
                        >
                            Очистить корзину
                        </button>
                    </div>
                    <div className='bas_products'>
                        {basket.map(item => {
                            return <BasketItem key={item.id} item={item}/>
                        })}
                    </div>
                    <div className='total_count'>
                        <div>
                            <b>Сумма: </b>
                            {totalPrice} ₽
                        </div>
                    </div>
                    <div className='order_button'>
                        <button
                            className='button'
                            onClick={() => setActive(true)}
                        >Оформить заказ
                        </button>
                    </div>
                </div>
            }
            <Modal active={active} setActive={setActive}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium consectetur, cupiditate
                dolore eum ipsum? Blanditiis, deserunt, dolore excepturi harum id illo ipsam nihil nostrum praesentium
                quia, quis soluta vitae?
            </Modal>
        </div>
    );
};

export default BasketPage