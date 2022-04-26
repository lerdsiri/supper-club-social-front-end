import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { User, RootState } from 'types';
import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import styles from 'pages/AdminConsole/AdminConsole.module.css';

// Admin console is the protected route available only if user.isAdmin is true.
// Currently the only feature restricted to admin is banning users.
export default function AdminConsole() {
  // allUsers are set up as useState instead of being stored in redux store
  // as allUsers only concern the admin console page.
  const [ allUsers, setAllUsers ] = useState<User[]>([]);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    fetch(`https://supper-club-social-backend.herokuapp.com/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setAllUsers(data))
  }, [token]);

  const handleClickBanUnban = (userId: string, isBeingBanned: boolean): void => {
    // First, user's isBanned status is updated to true or false.
    // Then, fetch all users' data and update allUsers useState again.
    axios
      .put(`https://supper-club-social-backend.herokuapp.com/api/v1/users/${userId}`, 
        { isBanned: isBeingBanned },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((data) => {
        fetch(`https://supper-club-social-backend.herokuapp.com/api/v1/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((res) => res.json())
          .then((data) => setAllUsers(data))
      })
  }

  return (
    <div className={styles.container}>
        <TopBanner />
        <main className={styles["main-content"]}>
            <nav>
                <NavBar />
            </nav>
            <section className={styles["main-content__user-details"]}>
                <div>
                  <h4>ALL USERS</h4>
                  {allUsers?.map((oneUser) => 
                    <div className={styles["user-profile-box"]} key={oneUser._id}>
                      <div className={styles["user-profile-content"]}>
                        <div className={styles["image-container"]}><img src={oneUser.profilePic} alt="user-profile-pic" /></div>
                        <div className={styles["user-profile-info"]}>
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
                        {/* If user is already banned, show the unban button. Otherwise, show the ban button. */}
                        { !oneUser.isBanned && 
                          <button className={styles["ban-unban-button"]} onClick={() => handleClickBanUnban(oneUser._id.toString(), true)}>Ban user</button>
                        }
                        { oneUser.isBanned && 
                          <button className={styles["ban-unban-button"]} onClick={() => handleClickBanUnban(oneUser._id.toString(), false)}>Unban user</button>
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
