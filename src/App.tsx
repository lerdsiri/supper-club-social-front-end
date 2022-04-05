import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from 'pages/Home/Home';
import './App.css';
import MyPage from 'pages/MyPage/MyPage';
import MyProfile from 'pages/MyProfile/MyProfile';
import MyEvents from 'pages/MyEvents/MyEvents';
import MyMessages from 'pages/MyMessages/MyMessages';


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/myprofile' element={<MyProfile />} />
          <Route path='/myevents' element={<MyEvents />} />
          <Route path='/mymessages' element={<MyMessages />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

