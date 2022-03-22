import { useSelector } from 'react-redux';

import mainpic from 'assets/images/main-pic.jpg';
import MyPage from 'pages/MyPage/MyPage';
import Signup from 'components/Signup/Signup';
import Login from 'components/Login/Login';
import { RootState } from 'types';
import 'pages/Home/Home.css';

export default function Home() {
    const isLoggedin = useSelector((state: RootState) => state.user.isLoggedin);

    if(isLoggedin) {
        return <MyPage />;
    } else {
        //signup and login page
        return (
            <div className='container'>
                <div className='logo'>
                    <img src={mainpic} alt='main' />
                    <div>
                        <h4>Supper<br />Club<br />Social</h4>
                        <p>Connecting communities one homecooked meal at a time</p>
                    </div>
                </div>
                <div className='signup-and-login'>
                    <div className='signup'>
                        <h5>Sign up today and start organizing or enjoying meals prepared by excellent homecooks in your community</h5> 
                        <Signup />
                    </div>
                    <div className='login'>
                        <h5>Already signed up? Log in here.</h5><br />
                        <Login />
                    </div>
                </div>
            </div>
        );
    }
}