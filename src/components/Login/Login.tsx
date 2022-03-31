import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { userActions } from 'store/userSlice';
import 'components/Login/Login.css';

export default function Login() {
  const initialValues = {
    email: "",
    password: "",
  }

  const userSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required("Email is required."),
    password: yup.string().min(8, "Password must be at least 8 characters long.").required("Password is required")
  })

  const dispatch = useDispatch();

  return (
    <div>
        <p className="form-type">Login</p>
        <div className="login-form">
          <Formik
            initialValues={initialValues}
            validationSchema={userSchema}
            onSubmit={(values) => {
              axios
                .post('http://localhost:5000/api/v1/users/login', values)
                .then((data) => {
                  const user = data.data.userLessPassword;
                  const token = data.data.token;
                  dispatch(userActions.getUser({ user, token }));
                })
                .catch((error) => alert("Email or password is invalid."));
            }}
          >
            {({values, errors, touched}) => (
              <Form>
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
                <button type="submit">Login</button>
              </Form>
            )}
          </Formik>
        </div>
    </div>
  )
}