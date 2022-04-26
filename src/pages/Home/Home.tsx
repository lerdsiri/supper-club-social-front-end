import { useSelector } from 'react-redux';
import mainpic from 'assets/images/main-pic.jpg';

import { RootState } from 'types';
import MyPage from 'pages/MyPage/MyPage';
import Signup from 'components/Signup/Signup';
import Login from 'components/Login/Login';
import styles from 'pages/Home/Home.module.css';

export default function Home() {
    const isLoggedin = useSelector((state: RootState) => state.user.isLoggedin);

    // After user has logged in, isLoggedin state would have been changed to true.
    // If user is logged in, go to MyPage.
    // Otherwise, show the signup and login page
    if(isLoggedin) {
        return <MyPage />;
    } else {
        //signup and login page
        return (
            <div className={styles.container}>
                {/* Top part with main pic, logo, and tagline */}
                <div className={styles.logo}>
                    <img src={mainpic} alt='main' />
                    <div>
                        <h4>Supper<br />Club<br />Social</h4>
                        <p>Connecting communities one homecooked meal at a time</p>
                    </div>
                </div>
                {/* Bottom part with signup form and login form */}
                <div className={styles['signup-and-login']}>
                    <div className={styles.signup}>
                        <h5 className={styles['description-text']}>Sign up today and start organizing or enjoying meals prepared by excellent homecooks in your community</h5> 
                        <Signup />
                    </div>
                    <div className={styles.login}>
                        <h5 className={styles['description-text']}>Already signed up? Log in here.</h5><br />
                        <Login />
                    </div>
                </div>
            </div>
        );
    }
}