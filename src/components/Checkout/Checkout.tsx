import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import styles from 'components/Checkout/Checkout.module.css';

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
      cardNum: yup.string().min(16, "16 digits required").max(16, "16 digits required").required("Credit card number is required."),
      expiry: yup.string().required("Card expiry date is required"),
      cvvCvc: yup.string().min(3, "3 digits required").max(3, "3 digits required").required("CVV/CVC is required"),
    })

  return (
    <div>
        <p className={styles["form-type"]}>Payment Details</p>
        <div className={styles["payment-form"]}>
            {/* Credit card input form */}
            <Formik
                initialValues={initialValues}
                validationSchema={userSchema}
                onSubmit={(values) => {
                    //    This is only a faked payment. No actual payment system is
                    // set up here.
                    //    Upon clicking pay, loop through the cart. For each eventId in the cart, 
                    // update user's list of eventsAsAttendee in the backend by adding the eventId.
                    // --> then update user's cart in the backend by removing the eventId --> then
                    // fetch updated user's data and dispatch it to redux store.
                    //    Once user's data in redux store is updated, cart should now be empty,
                    // and user's MyEvents page should show these events in list of 
                    // eventsAsAttendee. User's MyMessages page should also now show the 
                    // message board for each added events.
                    user.cart?.forEach((eventId) => {
                        axios
                            .patch(`https://supper-club-social-backend.herokuapp.com/api/v1/users/${user._id}/eventsAsAttendee/events/${eventId}`, {}, {
                                headers: { Authorization: `Bearer ${token}`}
                            })
                            .then((data) => {
                                axios
                                    .put(`https://supper-club-social-backend.herokuapp.com/api/v1/users/${user._id}/cart/events/${eventId}`, {}, {
                                    headers: { Authorization: `Bearer ${token}`}
                                })
                                .then((data) => {
                                    fetch(`https://supper-club-social-backend.herokuapp.com/api/v1/users/${user._id}`, {
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
                    
                    //    Faked credit card input is not used. User simply gets an alert that the
                    // payment was successful.
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
                                ? (<div className={styles.Errors}>{errors.name}</div>)
                                : null
                            }
                        </div>
                        <div>
                            <label htmlFor="cardNum">Credit Card Number</label>
                            <Field id="cardNum" name="cardNum" />
                            {errors.cardNum && touched.cardNum
                                ? (<div className={styles.Errors}>{errors.cardNum}</div>)
                                : null
                            }
                        </div>
                        <div>
                            <label htmlFor="expiry">Expiry Date</label>
                            <Field id="expiry" name="expiry" placeholder="MM/YYYY" />
                            {errors.expiry && touched.expiry
                                    ? (<div className={styles.Errors}>{errors.expiry}</div>)
                                : null
                            }
                        </div>
                        <div>
                            <label htmlFor="cvvCvc">CVV/CVC</label>
                            <Field id="cvvCvc" name="cvvCvc" placeholder="***" />
                            {errors.cvvCvc && touched.cvvCvc
                                ? (<div className={styles.Errors}>{errors.cvvCvc}</div>)
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
