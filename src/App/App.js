import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./Context/app";
import { AuthProvider } from "./Context/auth";
import Loader from "./Loader";
import { Notifications } from "./Notifications";
import MainLayout from "./layouts/MainLayout";
import BlankLayout from "./layouts/BlankLayout";
import { Overview } from "../Pages/Overview";
import MarketListView from "../Pages/MarketList/View";
import { BillList } from "../Pages/Bill/List";
import { BillCreate } from "../Pages/Bill/Create";
import { NotFound } from "../Pages/NotFound";
import { Logout } from "../Pages/Logout";
import { BillEdit } from "../Pages/Bill/Edit";
import { ProductList } from "../Pages/Product/List";
import CreateOptionsMarketList from "../features/market-list/CreateOptions";
import CreateBlankMarketList from "../features/market-list/CreateBlank";

function App() {
    return (
        <HashRouter>
            <AuthProvider>
                <AppProvider>
                    {/* <AppHeader />
                     */}
                    <Loader />
                    <Notifications />
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route index element={<Overview />} />
                            <Route path="products" element={<ProductList />} />
                            <Route path="bills" element={<BillList />} />
                        </Route>
                        <Route element={<BlankLayout />}>
                            <Route path="market-list">
                                <Route path=":id" element={<MarketListView />} />
                                <Route path="create" element={<CreateOptionsMarketList />} />
                                <Route path="create/blank" element={<CreateBlankMarketList />} />
                            </Route>
                            <Route path="bills">
                                <Route path="create" element={<BillCreate />} />
                                <Route path="edit/:id" element={<BillEdit />} />
                            </Route>
                        </Route>
                        <Route path="logout" element={<Logout />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AppProvider>
            </AuthProvider>
        </HashRouter>
    );
}

export default App;
