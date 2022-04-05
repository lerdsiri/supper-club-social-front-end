import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import 'components/Signup/Signup.css';

export default function Signup() {
  const initialValues = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      location: {
        city: "",
        postCode: "",
        country: ""
      }
  }

  const userSchema = yup.object().shape({
    username: yup.string().min(6, "Too short").max(20, "Too long").required("Username is required."),
    email: yup.string().email('Invalid email').required("Email is required."),
    password: yup.string().min(8, "Password must be at least 8 characters long.").required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Password must match"),
    firstName: yup.string().max(20, "Too long"), 
    lastName: yup.string().max(20, "Too long"),
    location: yup.object().shape({
      city: yup.string().required("City is required"),
      postCode: yup.string().max(10, "Too long"),
      country: yup.string().max(20, "Too long")
    })
  })

  return (
    <div>
        <p className="form-type">Sign up</p>
        <div className="signup-form">
          <Formik
            initialValues={initialValues}
            validationSchema={userSchema}
            onSubmit={(values) => {
              axios
                .post('http://localhost:5000/api/v1/users', values)
                .then((data) => {
                  console.log("Signup data: ", data);
                  alert("Signup successful! You may log in now.");             
                })
                .catch((error) => {
                  alert("Signup failed!");
                  console.log(error);
                });
            }}
          >
            {({values, errors, touched}) => (
              <Form>
                <div>
                  <label htmlFor="username">Username</label>
                  <Field id="username" name="username" />
                  {errors.username && touched.username
                    ? (<div className="Errors">{errors.username}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <Field id="email" name="email" />
                  {errors.email && touched.email
                    ? (<div className="Errors">{errors.email}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <Field id="password" name="password" />
                  {errors.password && touched.password
                    ? (<div className="Errors">{errors.password}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <Field id="confirmPassword" name="confirmPassword" />
                  {errors.confirmPassword && touched.confirmPassword
                    ? (<div className="Errors">{errors.confirmPassword}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="firstName">First name</label>
                  <Field id="firstName" name="firstName" />
                  {errors.firstName && touched.firstName
                    ? (<div className="Errors">{errors.firstName}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="lastName">Last name</label>
                  <Field id="lastName" name="lastName" />
                  {errors.lastName && touched.lastName
                    ? (<div className="Errors">{errors.lastName}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="city">City</label>
                  <Field id="city" name="location.city" />
                  {errors.location?.city && touched.location?.city
                    ? (<div className="Errors">{errors.location.city}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="postCode">Postal code</label>
                  <Field id="postCode" name="location.postCode" />
                  {errors.location?.postCode && touched.location?.postCode
                    ? (<div className="Errors">{errors.location.postCode}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="country">Country</label>
                  <Field id="country" name="location.country" />
                  {errors.location?.country && touched.location?.country
                    ? (<div className="Errors">{errors.location.country}</div>)
                    : null
                  }
                </div>
                <button type="submit">Sign up</button>
              </Form>
            )}
          </Formik>
        </div>
    </div>
  )
}


