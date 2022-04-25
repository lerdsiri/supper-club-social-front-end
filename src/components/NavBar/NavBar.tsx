import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import { eventActions } from 'store/eventSlice';
import { conversationActions } from 'store/conversationSlice';
import styles from 'components/NavBar/NavBar.module.css';

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  //    Function to handle logout by clearing out all the states in redux store.
  //    By clearing out token and resetting isLoggedin to false (in user slice),
  // protected routes can no longer be accessed and user is led back login page.
  const handleLogout = () => {
    dispatch(userActions.clearUser());
    dispatch(eventActions.clearEvents());
    dispatch(conversationActions.clearConversations());
  }

  //    If the app crashes for any reasons and user state (including token and 
  // isLoggedin status) in redux store persists, it may be necessary to force a 
  // logout by manually invoking handleLogout function here:
  //    handleLogout();

  return (
    <div>
      {/* Profile pic, username, user's current location */}
      <div>
        {!user.profilePic && <p className={styles["empty-profile-pic"]}><br /><br />Profile Pic</p>}
        {user.profilePic && <img className={styles["profile-pic"]} src={user.profilePic} alt='profilePic' />} 
        <h5>{user.username}</h5>
        <p>
          {user.location.city.charAt(0).toUpperCase() + user.location.city.slice(1).toLowerCase()}, 
          {user.location.country.charAt(0).toUpperCase() + user.location.country.slice(1).toLowerCase()}
        </p>
      </div>
      {/* Nav menu */}
      <div className={styles["nav-menu"]}>
        <div><Link to="/">My page</Link></div>
        <div><Link to="/myprofile">My profile</Link></div>
        <div><Link to="/mymessages">My messages</Link></div>
        <div><Link to="/myevents">My events</Link></div>
        <div><Link to='/' onClick={handleLogout}>Logout</Link></div>
        <br />

        {/* Admin console */}
        {user.isAdmin && <div><Link to="/adminconsole">Admin console</Link></div>}
      </div>
    </div>
  )
}
