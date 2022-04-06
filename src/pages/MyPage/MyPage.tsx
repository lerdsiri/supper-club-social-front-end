import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from "jwt-decode";

import 'pages/MyPage/MyPage.css';
import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import EventList from 'components/EventList/EventList';
import Cart from 'components/Cart/Cart';
import { userActions } from 'store/userSlice';
import { eventActions } from 'store/eventSlice';
import { conversationActions } from 'store/conversationSlice';
import { RootState } from 'types';

export default function MyPage() {
    const dispatch = useDispatch();
    const isLoggedin = useSelector((state: RootState) => state.user.isLoggedin);
    const token = useSelector((state: RootState) => state.user.token);

    useEffect(() => {
        if(isLoggedin) {
            const decodedToken: any = jwt_decode(token);
            const tokenExpiry = decodedToken.exp;
            const timeInMsTillExpiry = (tokenExpiry * 1000) - Date.now();

            setTimeout(() => {
                dispatch(userActions.clearUser());
                dispatch(eventActions.clearEvents());
                dispatch(conversationActions.clearConversations());
                alert("Logged Out");
            }, timeInMsTillExpiry);
        }   
    }, [dispatch, isLoggedin, token]);

    useEffect(() => {
    fetch('http://localhost:5000/api/v1/events')
        .then((response) => response.json())
        .then((data) => dispatch(eventActions.getEvents({events: data})));
    }, [dispatch]);

    return (
        <div className="container">
            <TopBanner />
            <main className="main-content">
                <nav>
                    <NavBar />
                </nav>
                <section className="main-content__events-by-city">
                    <EventList />
                </section>
                <section className="main-content__cart"> 
                    <Cart />
                </section>
            </main>
        </div>
    )
}
