import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import UserProfile from 'components/UserProfile/UserProfile';
import 'pages/MyProfile/MyProfile.css';

export default function MyPage() {
  return (
    <div className="container">
        <TopBanner />
        <main className="main-content">
            <nav>
                <NavBar />
            </nav>
            <section className="main-content__user-profile">
                <UserProfile />
            </section>
        </main>
    </div>
  )
}
