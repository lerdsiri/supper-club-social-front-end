import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from 'pages/Home/Home';
import MyPage from 'pages/MyPage/MyPage';
import MyProfile from 'pages/MyProfile/MyProfile';
import MyEvents from 'pages/MyEvents/MyEvents';
import MyMessages from 'pages/MyMessages/MyMessages';
import AdminConsole from 'pages/AdminConsole/AdminConsole';
import { IsUserAuthenticated, IsUserUnauthenticated, IsUserAdmin } from 'components/UseAuth/UseAuth';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<IsUserUnauthenticated />}>
            <Route path='/' element={<Home />} />
          </Route>
          <Route element={<IsUserAuthenticated />}>
            <Route path='/mypage' element={<MyPage />} />
            <Route path='/myprofile' element={<MyProfile />} />
            <Route path='/myevents' element={<MyEvents />} />
            <Route path='/mymessages' element={<MyMessages />} />
          </Route>
          <Route element={<IsUserAdmin />}>
              <Route path='/adminconsole' element={<AdminConsole />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

