import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from "jwt-decode";

import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import { eventActions } from 'store/eventSlice';
import { conversationActions } from 'store/conversationSlice';
import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import EventList from 'components/EventList/EventList';
import Cart from 'components/Cart/Cart';
import styles from 'pages/MyPage/MyPage.module.css';

export default function MyPage() {
    const dispatch = useDispatch();
    const isLoggedin = useSelector((state: RootState) => state.user.isLoggedin);
    const token = useSelector((state: RootState) => state.user.token);

    //    Setting up automatic logout when the token expires by calculating the
    // time to lapse before token expires and using setTimeout. clearTimeout 
    // function is provided at the end so that if user logs out manually before
    // token's validity period has lapsed, setTimeout will be automatically cleared.
    //    By clearing out state in user slice, isLoggedin is reset to false and 
    // token in user slice is removed, which also triggers re-rendering. Upon 
    // re-rendering, logged-out user with no token can no longer access protected 
    // routes and is led back to signup/login page.
    //    Event slice and conversation slice are also cleared out upon logged out so
    // that no data persists in redux store upon logging out.
    useEffect(() => {
        if(isLoggedin) {
            const decodedToken: any = jwt_decode(token);
            const tokenExpiry = decodedToken.exp;
            const timeInMsTillExpiry = (tokenExpiry * 1000) - Date.now();

            const tokenTimer = setTimeout(() => {
                dispatch(userActions.clearUser());
                dispatch(eventActions.clearEvents());
                dispatch(conversationActions.clearConversations());
                alert("Logged Out");
            }, timeInMsTillExpiry);
            return() => clearTimeout(tokenTimer);
        }   
    }, [dispatch, isLoggedin, token]);

    //    Fetching all events that will be filtered based on user's current city or
    // search term so that the filtered result can be displayed in the middle 
    // column of MyPage.
    useEffect(() => {
    fetch('https://supper-club-social-backend.herokuapp.com/api/v1/events')
        .then((response) => response.json())
        .then((data) => dispatch(eventActions.getEvents({events: data})));
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <TopBanner />
            <main className={styles["main-content"]}>
                {/* Left column */}
                <nav>
                    <NavBar />
                </nav>
                 {/* Middle column */}
                <section className={styles["main-content__events-by-city"]}>
                    <EventList />
                </section>
                 {/* Right column */}
                <section className={styles["main-content__cart"]}> 
                    <Cart />
                </section>
            </main>
        </div>
    )
}
