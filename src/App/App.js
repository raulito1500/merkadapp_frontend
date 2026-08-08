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
import { GroupList } from "../Pages/Group/List";
import { GroupCreate } from "../Pages/Group/Create";
import { GroupView } from "../Pages/Group/View";
import { PersonalView } from "../Pages/Expense/Personal";
import { ExpenseCreate } from "../Pages/Expense/Create";
import { Login } from "../Pages/Login";

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
                            </Route>
                        </Route>
                        <Route path="login" element={<Login />} />
                        <Route path="logout" element={<Logout />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AppProvider>
            </AuthProvider>
        </HashRouter>
    );
}

export default App;
