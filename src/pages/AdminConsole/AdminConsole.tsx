import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import { User, RootState } from 'types';
import 'pages/AdminConsole/AdminConsole.css';

export default function AdminConsole() {
  const [ allUsers, setAllUsers ] = useState<User[]>([]);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setAllUsers(data))
  }, [token]);

  const handleClickBanUnban = (userId: string, isBeingBanned: boolean): void => {
    axios
      .put(`http://localhost:5000/api/v1/users/${userId}`, 
        { isBanned: isBeingBanned },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((data) => {
        fetch(`http://localhost:5000/api/v1/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((res) => res.json())
          .then((data) => setAllUsers(data))
      })
  }

  return (
    <div className="container">
        <TopBanner />
        <main className="main-content">
            <nav>
                <NavBar />
            </nav>
            <section className="main-content__user-details">
                <div>
                  <h4>ALL USERS</h4>
                  {allUsers?.map((oneUser) => 
                    <div className="user-profile-box" key={oneUser._id}>
                      <div className="user-profile-content">
                        <div className="image-container"><img src={oneUser.profilePic} alt="user-profile-pic" /></div>
                        <div className="user-profile-info">
                          <div>Username   :  {oneUser.username}</div>
                          <div>Email      :  {oneUser.email}</div>
                          <div>First name :  {oneUser.firstName}</div>
                          <div>Last name  :  {oneUser.lastName}</div>
                          <div>City       :  {oneUser.location.city}</div>
                          <div>Postal Code:  {oneUser.location.postCode}</div>
                          <div>Country    :  {oneUser.location.country}</div>
                          <div>Is admin?  :  {oneUser.isAdmin ? "Yes" : "No"}</div>
                          <div>Is banned? :  {oneUser.isBanned ? "Yes" : "No"}</div>
                        </div>
                      </div>
                      <div>
                        { !oneUser.isBanned && 
                          <button className="ban-unban-button" onClick={() => handleClickBanUnban(oneUser._id.toString(), true)}>Ban user</button>
                        }
                        { oneUser.isBanned && 
                          <button className="ban-unban-button" onClick={() => handleClickBanUnban(oneUser._id.toString(), false)}>Unban user</button>
                        }
                      </div>
                    </div>
                  )}
                </div>
            </section>
        </main>
    </div>
  )
}
