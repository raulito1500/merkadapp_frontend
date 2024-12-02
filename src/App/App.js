import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './Context/app';
import { AuthProvider } from './Context/auth';
import { Container } from 'react-bootstrap';
import { AppHeader } from './AppHeader';
import { AppNavBar } from './AppNavbar';
import { Overview } from '../Pages/Overview';
import { MarketListView } from '../Pages/MarketList/View';
import { BillList } from '../Pages/Bill/List';
import { BillCreate } from '../Pages/Bill/Create';
import { NotFound } from '../Pages/NotFound';
import { Logout } from '../Pages/Logout';
import { Login } from '../Pages/Login';
import { BillEdit } from '../Pages/Bill/Edit';
import { UtilitiesProvider } from './Context/utilities';
import { ProductList } from '../Pages/Product/List';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppProvider>
          <AppHeader />
          <AppNavBar />
          <UtilitiesProvider>
            <Container className='pb-5 mb-5'>
              <Routes>
                <Route path='/' element={<Overview />} />
                <Route path='/market-list/:id' element={<MarketListView />} />
                <Route path='/bills' element={<BillList />} />
                <Route path='/bills/create' element={<BillCreate />} />
                <Route path='/bills/edit/:id' element={<BillEdit />} />
                <Route path='/products' element={<ProductList />} />
                <Route path='/login' element={<Login />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Container>
          </UtilitiesProvider>
        </AppProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
