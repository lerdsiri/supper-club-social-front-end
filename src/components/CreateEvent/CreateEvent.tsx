import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import 'components/CreateEvent/CreateEvent.css';
import { eventActions } from 'store/eventSlice';
import { userActions } from 'store/userSlice';
import { RootState } from 'types';

export default function CreateEvent() {
  const initialValues = {
    eventName: "",
    eventDateTime: new Date(Date.now()),
    status: 'ongoing',
    eventLoc: {
      address: "",
      city: "",
      postCode: "",
      country: "",
    },
    mainPic: "",
    cuisine: "",
    description: "",
    responseDateline: new Date(Date.now()),
    contributionAmt: 0,
    contributionCurrency: "EUR",
    numOfAttendeesAllowed: 0
  };

  const eventSchema = yup.object().shape({
    eventName: yup.string().min(8, "Too short").max(50, "Too long").required("Event name is required."),
    eventDateTime: yup.date().required("Event date and time are required"),
    eventLoc: yup.object().shape({
      address: yup.string().required("Address is required"),
      city: yup.string().required("City is required"),
      postCode: yup.string().required("Postal code is required"),
      country: yup.string().required("Country is required")
    }),
    cuisine: yup.string().max(30, "Too long"),
    description: yup.string().max(100, "Too long").required("Description is required"),
    responseDateline: yup.date().required("Response dateline is required"),
    contributionAmt: yup.number().required("Contribution amount is required"),
    contributionCurrency: yup.string().required("Contribution currency is required."),
    numOfAttendeesAllowed: yup.number().min(2, "Too few.").required("Number of attendees allowed is required.")
  });

  const dispatch = useDispatch();
  const user = useSelector((state:RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);

  return (
    <div>
        <p className="form-type">Create New Event</p>
        <div className="create-event-form">
          <Formik
            initialValues={initialValues}
            validationSchema={eventSchema}
            onSubmit={(values) => {
              axios
                .post('http://localhost:5000/api/v1/events', values, {
                  headers: { Authorization: `Bearer ${token}`}
                })
                .then((data) => {
                  alert("Event created!");
                  dispatch(eventActions.addEvent({event: data.data}));
                  
                  // adding the created event to user's list of eventsAsOrganizer
                  axios
                    .patch(`http://localhost:5000/api/v1/users/${user._id}/eventsAsOrganizer/events/${data.data._id}`, {}, {
                      headers: { Authorization: `Bearer ${token}`}
                    })
                    .then((data) => {
                      dispatch(userActions.updateUser({updatedUser: data.data}));
                    })
                    .catch((error) => console.log("Error adding event to user's list of eventsAsOrganizer.", error));
                })
                .catch((error) => {
                  alert("Error creating event!");
                  console.log("Error creating event", error);
                });
            }}
          >
            {({values, errors, touched}) => (
              <Form>
                <div>
                  <label htmlFor="eventName">Event name</label>
                  <Field id="eventName" name="eventName" />
                  {errors.eventName && touched.eventName
                    ? (<div className="Errors">{errors.eventName}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="eventDateTime">Event date and time</label>
                  <Field id="eventDateTime" name="eventDateTime" />
                  {errors.eventDateTime && touched.eventDateTime
                    ? (<div className="Errors">{errors.eventDateTime}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="address">Address</label>
                  <Field id="address" name="eventLoc.address" />
                  {errors.eventLoc?.address && touched.eventLoc?.address
                    ? (<div className="Errors">{errors.eventLoc.address}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="city">City</label>
                  <Field id="city" name="eventLoc.city" />
                  {errors.eventLoc?.city && touched.eventLoc?.city
                    ? (<div className="Errors">{errors.eventLoc.city}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="postCode">Postal Code</label>
                  <Field id="postCode" name="eventLoc.postCode" />
                  {errors.eventLoc?.postCode && touched.eventLoc?.postCode
                    ? (<div className="Errors">{errors.eventLoc.postCode}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="country">Country</label>
                  <Field id="country" name="eventLoc.country" />
                  {errors.eventLoc?.country && touched.eventLoc?.country
                    ? (<div className="Errors">{errors.eventLoc.country}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="cuisine">Cuisine</label>
                  <Field id="cuisine" name="cuisine" />
                  {errors.cuisine && touched.cuisine
                    ? (<div className="Errors">{errors.cuisine}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <Field id="description" name="description" />
                  {errors.description && touched.description
                    ? (<div className="Errors">{errors.description}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="responseDateline">Response Dateline</label>
                  <Field id="responseDateline" name="responseDateline" />
                  {errors.responseDateline && touched.responseDateline
                    ? (<div className="Errors">{errors.responseDateline}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="contributionAmt">Contribution Amount</label>
                  <Field id="contributionAmt" name="contributionAmt" />
                  {errors.contributionAmt && touched.contributionAmt
                    ? (<div className="Errors">{errors.contributionAmt}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="contributionCurrency">Contribution Currency</label>
                  <Field id="contributionCurrency" name="contributionCurrency" />
                  {errors.contributionCurrency && touched.contributionCurrency
                    ? (<div className="Errors">{errors.contributionCurrency}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="numOfAttendeesAllowed">Number of attendees allowed</label>
                  <Field id="numOfAttendeesAllowed" name="numOfAttendeesAllowed" />
                  {errors.numOfAttendeesAllowed && touched.numOfAttendeesAllowed
                    ? (<div className="Errors">{errors.numOfAttendeesAllowed}</div>)
                    : null
                  }
                </div>
                <button type="submit">Create Event</button>
              </Form>
            )}
          </Formik>
        </div>
    </div>
  )
}


