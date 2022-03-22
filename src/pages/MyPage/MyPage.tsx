import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import EventSearch from 'components/EventsSearch/EventSearch';
import Cart from 'components/Cart/Cart';
import 'pages/MyPage/MyPage.css';

export default function MyPage() {
  return (
    <div className="container">
        <TopBanner />
        <main className="main-content">
            <nav>
                <NavBar />
            </nav>
            <section className="main-content__events-by-city">
                <EventSearch />
            </section>
            <section className="main-content__cart"> 
                <Cart />
            </section>
        </main>
    </div>
  )
}
