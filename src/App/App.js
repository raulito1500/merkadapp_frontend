import React from 'react';
import { AppProvider } from './Context';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AppHeader } from './AppHeader';
import { AppNavBar } from './AppNavbar';
import { Overview } from '../Pages/Overview';
import { MarketListView } from '../Pages/MarketList/MarketListView';
import { BillList } from '../Pages/Bill/BillList';
import { NotFound } from '../Pages/NotFound';

function App() {
  return (
    <>
      <HashRouter>
        <AppProvider>
          <AppHeader />
          <AppNavBar />
          <Container>
            <Routes>
              <Route path='/' element={<Overview />} />
              <Route path='/market-list/:id' element={<MarketListView />} />
              <Route path='/bills' element={<BillList />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Container>
        </AppProvider>
      </HashRouter >
    </>
  );
}

export default App;
