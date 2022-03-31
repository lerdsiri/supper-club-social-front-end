import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import 'pages/MyPage/MyPage.css';
import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import EventList from 'components/EventList/EventList';
import Cart from 'components/Cart/Cart';
import { eventActions } from 'store/eventSlice';

export default function MyPage() {
    const dispatch = useDispatch();

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
