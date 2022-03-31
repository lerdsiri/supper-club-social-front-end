import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import 'components/NavBar/NavBar.css';
import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import { eventActions } from 'store/eventSlice';
import merkel from 'assets/images/merkel.jpg';

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(userActions.clearUser());
    dispatch(eventActions.clearEvents());
  }

  //handleLogout();

  return (
    <div>
      <div>
        <img className='profile-pic' src={merkel} alt='Merkel' />
        <h5>{user.username}</h5>
        <p>{user.location.city}, {user.location.country}</p>
      </div>
      <div className="nav-menu">
        <div><Link to="/">My page</Link></div>
        <div><Link to="/myprofile">My profile</Link></div>
        <div>My messages</div>
        <div><Link to="/myevents">My events</Link></div>
        <div><Link to='/' onClick={handleLogout}>Logout</Link></div>
        <br />
        <div>My upcoming events</div> 
      </div>
    </div>
  )
}
