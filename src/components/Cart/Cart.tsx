import { useState } from 'react';
import { useDispatch ,useSelector } from 'react-redux';
import axios from 'axios';

import { Event } from 'types';
import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import Checkout from 'components/Checkout/Checkout';
import 'components/Cart/Cart.css';

export default function Cart() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
  const events = useSelector((state: RootState) => state.event.eventsByCity);
  const [ showPaymentForm, setShowPaymentForm ] = useState(false);
  
  let eventsInCart: Event[] = [];

  user.cart?.map((eventId) => (
    events?.map((anEvent) => {
      if(eventId === anEvent._id) {
        eventsInCart.push(anEvent)
      }
      return null;
    })
  ))

  const total = eventsInCart?.map((anEvent) => anEvent.contributionAmt).reduce((a,b) => a + b, 0);

  const handleClickRemove = (eventId: string): void => {
    axios
      .put(`http://localhost:5000/api/v1/users/${user._id}/cart/events/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}`}
      })
      .then((data) => dispatch(userActions.updateUser({updatedUser: data.data})))
      .catch((error) => console.log("Error removing item from cart.", error));
  }

  const handleClickCheckout = () => {
    setShowPaymentForm(true);
  }

  //console.log("eventsInCart: ", eventsInCart);

  return (
    <div className="cart-column">
      <div>
        <h4>Cart</h4>
      </div>
      <div>
        {user.cart.length === 0 && <div>Cart is empty</div>}
        {eventsInCart?.map((anEvent) => (
          <div className="event-item" key={anEvent._id}>
            <div className="event-name">{anEvent.eventName}</div>
            <div className="small-text">Where: {anEvent.eventLoc.city}, {anEvent.eventLoc.country}</div>
            <div className="small-text">When: {anEvent.eventDateTime}</div>
            <div className="small-text">Response By: {anEvent.responseDateline}</div>
            <br />
            <div><b>Cost: </b>{anEvent.contributionCurrency} {anEvent.contributionAmt}</div> 
            <button className="remove-button" onClick={() => handleClickRemove(anEvent._id)}>Remove</button>
          </div>
        ))}
      </div>
      <div>
        {user.cart.length !== 0 &&
          <div>
            <h4 className="total">
            Total: EUR {total}
            </h4>
            <button className="button" onClick={handleClickCheckout}>Checkout</button>
          </div>
        }
      </div>
      <div>
        {showPaymentForm && <Checkout setShowPaymentForm={setShowPaymentForm} total={total} />}
      </div>
      
    </div>
  )
}
