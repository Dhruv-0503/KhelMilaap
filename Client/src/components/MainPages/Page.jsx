import React, { useEffect } from 'react';
import HomePage from './HomePage/HomePage';
import AllCommunity from './Community/AllCommunity';
import {Routes , Route, useLocation} from 'react-router-dom';
import AllCoach from './Coach/AllCoach';
import SportEvent from './SportEvent/SportEvent'
import LoginRegister from './AuthPages/LoginRegister';
import ProfilePage from './ProfilePage/ProfilePage';


const Page = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route path = '/' element = {<HomePage/>}/>
      <Route path = '/community' element = {<AllCommunity/>}/>
      <Route path = '/coach' element = {<AllCoach/>}/>
      <Route path = '/events' element = {<SportEvent/>}/>
      <Route path = '/login' element = {<LoginRegister/>}/>
      <Route path = '/profile' element = {<ProfilePage/>}/>
    </Routes>
  )
}

export default Page;