import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import { RootState } from 'types';
import 'components/Checkout/Checkout.css';
import { userActions } from 'store/userSlice';

export default function Checkout({setShowPaymentForm, total}: {
    setShowPaymentForm: React.Dispatch<React.SetStateAction<boolean>>, 
    total: number
}) {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const token = useSelector((state: RootState) => state.user.token);

    const initialValues = {
        name: "",
        cardNum: "",
        expiry: "",
        cvvCvc: "",
    }
  
    const userSchema = yup.object().shape({
      name: yup.string().required("Name is required."),
      cardNum: yup.string().min(16, "Too short").max(16, "Too long").required("Credit card number is required."),
      expiry: yup.string().required("Card expiry date is required"),
      cvvCvc: yup.string().min(3, "Too short").max(3, "Too long").required("CVV/CVC is required"),
    })

  return (
    <div>
        <p className="form-type">Payment Details</p>
        <div className="payment-form">
            <Formik
                initialValues={initialValues}
                validationSchema={userSchema}
                onSubmit={(values) => {
                    // This is only a faked payment
                    // No actual payment system is set up here.
                    user.cart?.forEach((eventId) => {
                        //console.log("eventId to be patched: ", eventId);
                        axios
                            .patch(`http://localhost:5000/api/v1/users/${user._id}/eventsAsAttendee/events/${eventId}`, {}, {
                                headers: { Authorization: `Bearer ${token}`}
                            })
                            .then((data) => {
                                axios
                                    .put(`http://localhost:5000/api/v1/users/${user._id}/cart/events/${eventId}`, {}, {
                                    headers: { Authorization: `Bearer ${token}`}
                                })
                                .then((data) => {
                                    fetch(`http://localhost:5000/api/v1/users/${user._id}`, {
                                        headers: { Authorization: `Bearer ${token}`}
                                    })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        //console.log("fetched data: ", data);
                                        dispatch(userActions.updateUser({updatedUser: data}));
                                    })
                                    .catch((error) => console.log("Error updating user in redux store.", error));
                                })
                                .catch((error) => console.log("Error clearing item from cart.", error));
                            })
                            .catch((error) => console.log("Error adding events to list of eventsAsAttendee.", error));
                    })
                    
                    alert("Payment successful!");

                    setShowPaymentForm(false);
                }}
            >
                {({values, errors, touched}) => (
                    <Form>
                        <div>
                            <label htmlFor="name">Name</label>
                            <Field id="name" name="name" />
                            {errors.name && touched.name
                                ? (<div className="Errors">{errors.name}</div>)
                                : null
                            }
                        </div>
                        <div>
                            <label htmlFor="cardNum">Credit Card Number</label>
                            <Field id="cardNum" name="cardNum" />
                            {errors.cardNum && touched.cardNum
                                ? (<div className="Errors">{errors.cardNum}</div>)
                                : null
                            }
                        </div>
                        <div>
                            <label htmlFor="expiry">Expiry Date</label>
                            <Field id="expiry" name="expiry" placeholder="MM/YYYY" />
                            {errors.expiry && touched.expiry
                                ? (<div className="Errors">{errors.expiry}</div>)
                                : null
                            }
                        </div>
                        <div>
                            <label htmlFor="cvvCvc">CVV/CVC</label>
                            <Field id="cvvCvc" name="cvvCvc" placeholder="***" />
                            {errors.cvvCvc && touched.cvvCvc
                                ? (<div className="Errors">{errors.cvvCvc}</div>)
                                : null
                            }
                        </div>
                        
                        <button type="submit">Pay EUR {total}</button>
                    </Form>
                )}
            </Formik>
        </div>    
    </div>
  )
}
