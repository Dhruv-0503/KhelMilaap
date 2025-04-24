import React from 'react';
import Header from './components/Headers/Header';
import Page from './components/MainPages/Page';
import Footer from './components/Footers/Footer';
// import { DataProvider } from './GlobalState';

const App = () => {
  return (
      <>
          <Header />
          <Page />
          <Footer/>     
      </>
  )
}

export default App;