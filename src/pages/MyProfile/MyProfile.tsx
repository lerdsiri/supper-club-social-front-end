import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import UserProfile from 'components/UserProfile/UserProfile';
import styles from 'pages/MyProfile/MyProfile.module.css';

export default function MyPage() {
  return (
    <div className={styles.container}>
        <TopBanner />
        <main className={styles["main-content"]}>
            {/* Left column */}
            <nav>
                <NavBar />
            </nav>
            {/* Right column */}
            <section className={styles["main-content__user-profile"]}>
                <UserProfile />
            </section>
        </main>
    </div>
  )
}
