import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';

import { userActions } from 'store/userSlice';
import styles from 'components/Login/Login.module.css';

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
        <p className={styles["form-type"]}>Login</p>
        <div className={styles["login-form"]}>
          <Formik
            initialValues={initialValues}
            validationSchema={userSchema}
            onSubmit={(values) => {
              // After logging in, save the returned user's data and token in redux store
              axios
                .post('https://supper-club-social-backend.herokuapp.com/api/v1/users/login', values)
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
                    ? (<div className={styles.Errors}>{errors.email}</div>)
                    : null
                  }
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <Field id="password" name="password" />
                  {errors.password && touched.password
                    ? (<div className={styles.Errors}>{errors.password}</div>)
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