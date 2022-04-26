import { useState } from 'react';
import { useDispatch ,useSelector } from 'react-redux';
import axios from 'axios';

import { Event } from 'types';
import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import Checkout from 'components/Checkout/Checkout';
import styles from 'components/Cart/Cart.module.css';

export default function Cart() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
  const events = useSelector((state: RootState) => state.event.events);
  const [ showPaymentForm, setShowPaymentForm ] = useState(false);
  
  let eventsInCart: Event[] = []; 

  //    Map through user's cart, which contains eventIds.
  //    For each eventId in user's cart, map through list of all events for a 
  // match. If matched, put the whole event object into eventsInCart array to 
  // be displayed.
  user.cart?.map((eventId) => (
    events?.map((anEvent) => {
      if(eventId === anEvent._id) {
        eventsInCart.push(anEvent)
      }
      return null;
    })
  ))

  //    Calculate total price of items in cart
  const total = eventsInCart?.map((anEvent) => anEvent.contributionAmt).reduce((a,b) => a + b, 0);

  //    Button to remove item from cart.
  //    First update the user's cart in the backend. Then dispatch the updated
  // user's data in redux store.
  const handleClickRemove = (eventId: string): void => {
    axios
      .put(`https://supper-club-social-backend.herokuapp.com/api/v1/users/${user._id}/cart/events/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}`}
      })
      .then((data) => dispatch(userActions.updateUser({updatedUser: data.data})))
      .catch((error) => console.log("Error removing item from cart.", error));
  }

  //    Handler for checkout button, which sets ShowPaymentForm to true upon 
  // clicking. This then shows the hidden payment form.
  const handleClickCheckout = () => {
    setShowPaymentForm(true);
  }

  return (
    <div className={styles["cart-column"]}>
      <div>
        <h4>Cart</h4>
      </div>
      {/* Cart display */}
      <div>
        {user.cart.length === 0 && <div>Cart is empty</div>}
        {eventsInCart?.map((anEvent) => (
          <div className={styles["event-item"]} key={anEvent._id}>
            <div className={styles["event-name"]}>{anEvent.eventName}</div>
            <div className={styles["small-text"]}>Where: {anEvent.eventLoc.city}, {anEvent.eventLoc.country}</div>
            <div className={styles["small-text"]}>When: {anEvent.eventDateTime}</div>
            <div className={styles["small-text"]}>Response By: {anEvent.responseDateline}</div>
            <br />
            <div><b>Cost: </b>{anEvent.contributionCurrency} {anEvent.contributionAmt}</div> 
            <button className={styles["remove-button"]} onClick={() => handleClickRemove(anEvent._id)}>Remove</button>
          </div>
        ))}
      </div>
      {/* Display of total price of items in cart */}
      <div>
        {user.cart.length !== 0 &&
          <div>
            <h4 className={styles.total}>
            Total: EUR {total}
            </h4>
            <button className={styles.button} onClick={handleClickCheckout}>Checkout</button>
          </div>
        }
      </div>
      {/* Conditional display of payment form at checkout */}
      <div>
        {showPaymentForm && <Checkout setShowPaymentForm={setShowPaymentForm} total={total} />}
      </div>
      
    </div>
  )
}
