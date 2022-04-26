import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
 
import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import styles from 'components/UserProfile/UserProfile.module.css';

export default function UserProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [profileImg, setProfileImg] = useState("");
    
    const user = useSelector((state: RootState) => state.user.user);
    const token = useSelector((state: RootState) => state.user.token);

    //    Initial values for user's profile edit form --> use existing data as 
    // the initial values so that the form is pre-filled with existing data.
    const initialValues = {
        firstName: user.firstName,
        lastName: user.lastName,
        location: {
          city: user.location.city,
          postCode: user.location.postCode,
          country: user.location.country
        }
    };
  
    const userSchema = yup.object().shape({
      firstName: yup.string().max(20, "Too long"), 
      lastName: yup.string().max(20, "Too long"),
      location: yup.object().shape({
        city: yup.string().required("City is required"),
        postCode: yup.string().max(10, "Too long"),
        country: yup.string().max(20, "Too long")
      })
    });

    //    Handler for button to delete user's profile, which delete user's 
    // profile in the backend. User data in redux store is then cleared
    // and the user redirected to the login page (Home).
    const handleClickDeleteProfile = () => {
        axios
            .delete(`https://supper-club-social-backend.herokuapp.com/api/v1/users/${user._id}`, { 
                headers: { Authorization: `Bearer ${token}`}
            })
            .then((data) => dispatch(userActions.clearUser()));
    
        navigate("/");
    }

    //    Handler for profile image file input. readAsDataURL is used to convert
    // the file's data into a base64 encoded string (accessible in result
    // attribute upon loadend). The encoded string is then assigned to profileImg
    // useState, which is used to display image preview and for uploading
    // to the backend.
    const handleFileInputChange = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if(typeof reader.result === "string") {
                setProfileImg(reader.result);
            }
        }
    }

    //    Handler for button to upload profile image by sending the image file's
    // data represetned by the encoded string (saved in profileImg useState) to
    // the backend to update user's data. The backend uploads the image data to 
    // Cloudinary (cloud platform for saving files and images), which returns
    // a URL for the image. The URL string is saved to user's profile image
    // data (string) in the backend. The returned updated user's data is then
    // dispatched to redux store.
    const handleSubmitPicFile = (e: any) => {
        e.preventDefault();
        if(!profileImg) return;

        console.log("imageSource: ", profileImg);

        try {
            axios
                .post(`https://supper-club-social-backend.herokuapp.com/api/v1/users/uploadprofileimg/${user._id}`, 
                    { profileImg: profileImg },
                    { headers: {Authorization: `Bearer ${token}`}}
                )
                .then((data) => {
                    dispatch(userActions.updateUser({updatedUser: data.data}))
                    setIsInEditMode(false)
                })
        } catch(error) {
            console.log("Error uploading image", error)
        }
    }

    return (
        <div>
            <div>
                {/* Toggle between profile display vs profile edit form */}
                <button className={styles.button} onClick={() => setIsInEditMode(!isInEditMode)}>Edit Profile</button>
                <button className={styles.button} onClick={handleClickDeleteProfile}>Delete Profile</button>
            </div>
            {/* Simply display profile data if not in edit mode */}
            {!isInEditMode && 
                <div className={styles["profile-info"]}>
                    <div>Username   :  {user.username}</div>
                    <div>Email      :  {user.email}</div>
                    <div>First name :  {user.firstName}</div>
                    <div>Last name  :  {user.lastName}</div>
                    <div>City       :  {user.location.city}</div>
                    <div>Postal Code:  {user.location.postCode}</div>
                    <div>Country    :  {user.location.country}</div>
                </div>
            }
            {/* Show profile edit form if in edit mode */}
            {isInEditMode &&
                <div>
                    <div>
                        <h5 className={styles["upload-pic-title"]}>Upload New Photo - may take up to 1 min</h5>
                        {/* Image upload area */}
                        <form className={styles["pic-upload-form"]} onSubmit={handleSubmitPicFile}>
                            <input 
                                className={styles["pic-upload"]} 
                                type="file" 
                                name="image" 
                                onChange={handleFileInputChange} 
                            /> 
                            <button className={styles.button} type="submit">Upload Image</button>
                        </form>
                        {/* Image preview display */}
                        {profileImg && (
                            <img 
                                className={styles["image-to-upload"]}
                                src={profileImg} 
                                alt="upload preview" 
                            />
                        )}
                    </div>
                    {/* Edit form for other profile data (username and email cannot be changed) */}
                    <div className={styles["edit-profile-form"]}>
                        <div>Username   :  {user.username}</div>
                        <div>Email      :  {user.email}</div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={userSchema}
                            onSubmit={(values) => {
                                //    When clicking submit, update user's data in the backend. Then
                                // dispatch the returned updated user's data to redux store.
                                console.log("Form values: ", values);
                                axios
                                    .put(`https://supper-club-social-backend.herokuapp.com/api/v1/users/${user._id}`, values, {
                                        headers: { Authorization: `Bearer ${token}`}
                                    })
                                    .then((data) => {
                                        const updatedUser = data.data;
                                        dispatch(userActions.updateUser({updatedUser}));
                                        alert("Update successful!");             
                                    })
                                    .catch((error) => {
                                        alert("Error! Update failed!");
                                        console.log(error);
                                    });
                                setIsInEditMode(false);
                            }}
                        >
                            {({values, errors, touched}) => (
                            //    User's profile edit form is pre-filled with initial values, which
                            // come from the existing user's profile data.
                            <Form>
                                <div>
                                    <label htmlFor="firstName">First name</label>
                                    <Field id="firstName" name="firstName" placeholder="first name" />
                                    {errors.firstName && touched.firstName
                                        ? (<div className={styles.Errors}>{errors.firstName}</div>)
                                        : null
                                    }
                                </div>
                                <div>
                                    <label htmlFor="lastName">Last name</label>
                                    <Field id="lastName" name="lastName" placeholder="last name" />
                                    {errors.lastName && touched.lastName
                                        ? (<div className={styles.Errors}>{errors.lastName}</div>)
                                        : null
                                    }
                                </div>
                                <div>
                                    <label htmlFor="city">City</label>
                                    <Field id="city" name="location.city" placeholder="city" />
                                    {errors.location?.city && touched.location?.city
                                        ? (<div className={styles.Errors}>{errors.location.city}</div>)
                                        : null
                                    }
                                </div>
                                <div>
                                    <label htmlFor="postCode">Postal code</label>
                                    <Field id="postCode" name="location.postCode" placeholder="postal code" />
                                    {errors.location?.postCode && touched.location?.postCode
                                        ? (<div className={styles.Errors}>{errors.location.postCode}</div>)
                                        : null
                                    }
                                </div>
                                <div>
                                    <label htmlFor="country">Country</label>
                                    <Field id="country" name="location.country" placeholder="country" />
                                    {errors.location?.country && touched.location?.country
                                        ? (<div className={styles.Errors}>{errors.location.country}</div>)
                                        : null
                                    }
                                </div>
                                <button type="submit">Submit Edits</button>
                            </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            }
        </div> 
    )
}
