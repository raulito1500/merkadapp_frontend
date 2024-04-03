import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AppHeader } from './AppHeader';
import { AppNavBar } from './AppNavbar';
import { MarketListWidget } from '../MarketListWidget';
import { MarketList } from '../MarketList';
import { Overview } from '../Overview';
import { NotFound } from '../NotFound';
import { BillList } from '../BillList';

function App() {
  return (
    <>
      <HashRouter>
        <AppHeader />
        <AppNavBar />
        <Container>
          <Routes>
            <Route path='/' element={<Overview />} />
            <Route path='/market-list/:id' element={<MarketList />} />
            <Route path='/bills' element={<BillList />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Container>
      </HashRouter>
    </>
  );
}

export default App;
