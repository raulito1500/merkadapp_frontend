import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./Context/app";
import { AuthProvider } from "./Context/auth";
import { Container } from "react-bootstrap";
import { AppHeader } from "./AppHeader";
import { AppNavBar } from "./AppNavbar";
import { Overview } from "../Pages/Overview";
import MarketListView from "../Pages/MarketList/View";
import { BillList } from "../Pages/Bill/List";
import { BillCreate } from "../Pages/Bill/Create";
import { NotFound } from "../Pages/NotFound";
import { Logout } from "../Pages/Logout";
import { BillEdit } from "../Pages/Bill/Edit";
import { ProductList } from "../Pages/Product/List";
import { Notifications } from "./Notifications";
import CreateMarketList from "../features/market-list/create";

function App() {
    return (
        <HashRouter>
            <AuthProvider>
                <AppProvider>
                    <AppHeader />
                    <AppNavBar />
                    <Notifications />
                    <Container className="pb-5 mb-5">
                        <Routes>
                            <Route path="/" element={<Overview />} />
                            <Route path="market-list">
                                <Route path=":id" element={<MarketListView />} />
                                <Route path="create" element={<CreateMarketList />} />
                            </Route>
                            <Route path="bills">
                                <Route index element={<BillList />} />
                                <Route path="create" element={<BillCreate />} />
                                <Route path="edit/:id" element={<BillEdit />} />
                            </Route>
                            <Route path="products" element={<ProductList />} />
                            <Route path="logout" element={<Logout />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Container>
                </AppProvider>
            </AuthProvider>
        </HashRouter>
    );
}

export default App;
