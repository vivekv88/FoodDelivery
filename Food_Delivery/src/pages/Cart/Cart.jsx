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
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{2}</p>
            </div>
            <div className="cart-total-details">
              <p>Total</p>
              <p>{0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
