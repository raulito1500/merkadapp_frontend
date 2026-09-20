import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./providers/app";
import { AuthProvider } from "./providers/auth";
import Loader from "./Loader";
import { Notifications } from "./Notifications";
import MainLayout from "./layouts/MainLayout";
import BlankLayout from "./layouts/BlankLayout";
import { Overview } from "../pages/Overview";
import MarketListView from "../pages/MarketList/View";
import { BillList } from "../pages/Bill/List";
import { BillCreate } from "../pages/Bill/Create";
import { NotFound } from "../pages/NotFound";
import { BillEdit } from "../pages/Bill/Edit";
import { ProductList } from "../pages/Product/List";
import CreateOptionsMarketList from "../features/market-list/CreateOptions";
import CreateBlankMarketList from "../features/market-list/CreateBlank";
import { GroupList } from "../pages/Group/List";
import { GroupCreate } from "../pages/Group/Create";
import { GroupView } from "../pages/Group/View";
import { GroupEdit } from "../pages/Group/Edit";
import { PersonalView } from "../pages/Expense/Personal";
import { ExpenseCreate } from "../pages/Expense/Create";
import { Login } from "../pages/Login";

function App() {
    return (
        <HashRouter>
            <AuthProvider>
                <AppProvider>
                    <Loader />
                    <Notifications />
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route index element={<Overview />} />
                            <Route path="products" element={<ProductList />} />
                            <Route path="bills" element={<BillList />} />
                            <Route path="expenses" element={<GroupList />} />
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
                            <Route path="expenses">
                                <Route path="create" element={<GroupCreate />} />
                                <Route path="personal" element={<PersonalView />} />
                                <Route path="personal/create" element={<ExpenseCreate />} />
                                <Route path=":groupId" element={<GroupView />} />
                                <Route path=":groupId/create" element={<ExpenseCreate />} />
                                <Route path=":groupId/edit" element={<GroupEdit />} />
                            </Route>
                        </Route>
                        <Route path="login" element={<Login />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AppProvider>
            </AuthProvider>
        </HashRouter>
    );
}

export default App;
