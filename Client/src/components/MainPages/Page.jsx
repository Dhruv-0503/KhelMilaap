import React, { useEffect , useState} from 'react';
import HomePage from './HomePage/HomePage';
import Dashboard from './HomePage/Dashboard';
import AllCommunity from './Community/AllCommunity';
import {Routes , Route, useLocation, Navigate} from 'react-router-dom';
import AllCoach from './Coach/AllCoach';
import SportEvent from './SportEvent/SportEvent'
import LoginRegister from './AuthPages/LoginRegister';
import ProfilePage from './ProfilePage/ProfilePage';
import AllChat from './Chat/AllChat';

const Page = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setIsLoggedIn(true);
    }
  })
  return (
    <Routes>
      <Route path='/login' element = {<LoginRegister/>}/>
      <Route path='/' element = {isLoggedIn ? <Dashboard/> : <HomePage/>}/>
      <Route path='/community' element = {isLoggedIn ? <AllCommunity/> : <LoginRegister/>}/>
      <Route path='/coach' element = {isLoggedIn ? <AllCoach/> : <LoginRegister/>}/>
      <Route path='/events' element = {isLoggedIn ? <SportEvent/> : <LoginRegister/>}/>
      <Route path='/profile' element = {isLoggedIn ? <ProfilePage/> : <LoginRegister/>}/>
      <Route path='/message' element = {isLoggedIn ? <AllChat/> : <LoginRegister/>}/>
    </Routes>
  )
}

export default Page;