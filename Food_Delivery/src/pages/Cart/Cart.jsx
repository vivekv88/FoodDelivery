import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
const Cart = () => {

  const { cartItems, food_list, removeFromCart } = useContext(StoreContext)

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((items, index) => {
          if (cartItems[items._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={items.image} alt="" />
                  <p>{items.name}</p>
                  <p>${items.price}</p>
                  <p>{cartItems[items._id]}</p>
                  <p>${items.price * cartItems[items._id]}</p>
                  <p onClick={() => removeFromCart(items._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>

            )
          }
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{0}</b>
            </div>
            <button>PROCEED TO CHECKOUT</button>
          </div>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a Promo Code, Please Enter here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='Enter Promocode' />
              <button className='promo-button'>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
