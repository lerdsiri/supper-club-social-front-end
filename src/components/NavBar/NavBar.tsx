import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import { eventActions } from 'store/eventSlice';
import { conversationActions } from 'store/conversationSlice';
import 'components/NavBar/NavBar.css';

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(userActions.clearUser());
    dispatch(eventActions.clearEvents());
    dispatch(conversationActions.clearConversations());
  }

  //handleLogout();

  return (
    <div>
      <div>
        {!user.profilePic && <p className="empty-profile-pic"><br /><br />Profile Pic</p>}
        {user.profilePic && <img className="profile-pic" src={user.profilePic} alt='profilePic' />} 
        <h5>{user.username}</h5>
        <p>{user.location.city}, {user.location.country}</p>
      </div>
      <div className="nav-menu">
        <div><Link to="/">My page</Link></div>
        <div><Link to="/myprofile">My profile</Link></div>
        <div><Link to="/mymessages">My messages</Link></div>
        <div><Link to="/myevents">My events</Link></div>
        <div><Link to='/' onClick={handleLogout}>Logout</Link></div>
        <br />

        {user.isAdmin && <div><Link to="/adminconsole">Admin console</Link></div>}
      </div>
    </div>
  )
}
