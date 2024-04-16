import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './Context';
import { AuthProvider } from './Context/auth';
import { Container } from 'react-bootstrap';
import { AppHeader } from './AppHeader';
import { AppNavBar } from './AppNavbar';
import { Overview } from '../Pages/Overview';
import { MarketListView } from '../Pages/MarketList/MarketListView';
import { BillList } from '../Pages/Bill/BillList';
import { NotFound } from '../Pages/NotFound';
import { Logout } from '../Pages/Logout';
import { Login } from '../Pages/Login';

function App() {
  return (
    <HashRouter>
        <AuthProvider>
          <AppProvider>
            <AppHeader />
            <AppNavBar />
            <Container>
              <Routes>
                <Route path='/' element={<Overview />} />
                <Route path='/market-list/:id' element={<MarketListView />} />
                <Route path='/bills' element={<BillList />} />
                <Route path='/login' element={<Login />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Container>
          </AppProvider>
        </AuthProvider>
      </HashRouter>
  );
}

export default App;
