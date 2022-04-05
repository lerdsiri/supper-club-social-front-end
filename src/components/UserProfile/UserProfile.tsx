import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
 
import { userActions } from 'store/userSlice';
import { RootState } from 'types';
import 'components/UserProfile/UserProfile.css';

export default function UserProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [profileImg, setProfileImg] = useState("");
    
    const user = useSelector((state: RootState) => state.user.user);
    const token = useSelector((state: RootState) => state.user.token);

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

    const handleClickDeleteProfile = () => {
        axios
            .delete(`http://localhost:5000/api/v1/users/${user._id}`, { 
                headers: { Authorization: `Bearer ${token}`}
            })
            .then((data) => dispatch(userActions.clearUser()));
    
        navigate("/");
    }

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

    const handleSubmitPicFile = (e: any) => {
        e.preventDefault();
        if(!profileImg) return;

        console.log("imageSource: ", profileImg);

        try {
            axios
                .post(`http://localhost:5000/api/v1/users/uploadprofileimg/${user._id}`, 
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
                <button className="button" onClick={() => setIsInEditMode(!isInEditMode)}>Edit Profile</button>
                <button className="button" onClick={handleClickDeleteProfile}>Delete Profile</button>
            </div>
            {!isInEditMode && 
                <div className="profile-info">
                    <div>Username   :  {user.username}</div>
                    <div>Email      :  {user.email}</div>
                    <div>First name :  {user.firstName}</div>
                    <div>Last name  :  {user.lastName}</div>
                    <div>City       :  {user.location.city}</div>
                    <div>Postal Code:  {user.location.postCode}</div>
                    <div>Country    :  {user.location.country}</div>
                </div>
            }
            {isInEditMode &&
                <div>
                    <div>
                        <h5 className="upload-pic-title">Upload New Photo</h5>
                        <form className="pic-upload-form" onSubmit={handleSubmitPicFile}>
                            <input 
                                className="pic-upload" 
                                type="file" 
                                name="image" 
                                onChange={handleFileInputChange} 
                            /> 
                            <button className="button" type="submit">Upload Image</button>
                        </form>
                        {profileImg && (
                            <img 
                                className="image-to-upload"
                                src={profileImg} 
                                alt="upload preview" 
                            />
                        )}
                    </div>
                    <div className="edit-profile-form">
                        <div>Username   :  {user.username}</div>
                        <div>Email      :  {user.email}</div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={userSchema}
                            onSubmit={(values) => {
                                console.log("Form values: ", values);
                                axios
                                    .put(`http://localhost:5000/api/v1/users/${user._id}`, values, {
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
                            <Form>
                                <div>
                                    <label htmlFor="firstName">First name</label>
                                    <Field id="firstName" name="firstName" placeholder="first name" />
                                    {errors.firstName && touched.firstName
                                        ? (<div className="Errors">{errors.firstName}</div>)
                                        : null
                                    }
                                </div>
                                <div>
                                    <label htmlFor="lastName">Last name</label>
                                    <Field id="lastName" name="lastName" placeholder="last name" />
                                    {errors.lastName && touched.lastName
                                        ? (<div className="Errors">{errors.lastName}</div>)
                                        : null
                                    }
                                </div>
                                <div>
                                    <label htmlFor="city">City</label>
                                    <Field id="city" name="location.city" placeholder="city" />
                                    {errors.location?.city && touched.location?.city
                                        ? (<div className="Errors">{errors.location.city}</div>)
                                        : null
                                    }
                                </div>
                                <div>
                                    <label htmlFor="postCode">Postal code</label>
                                    <Field id="postCode" name="location.postCode" placeholder="postal code" />
                                    {errors.location?.postCode && touched.location?.postCode
                                        ? (<div className="Errors">{errors.location.postCode}</div>)
                                        : null
                                    }
                                </div>
                                <div>
                                    <label htmlFor="country">Country</label>
                                    <Field id="country" name="location.country" placeholder="country" />
                                    {errors.location?.country && touched.location?.country
                                        ? (<div className="Errors">{errors.location.country}</div>)
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
