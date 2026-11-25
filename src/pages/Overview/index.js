import React, { useEffect, useState } from "react";
import { MarketListWidget } from "../../features/market-list/components/Widget";
import { Col, Row } from "react-bootstrap";
import { AppContext } from "../../app/providers/app";
import { useApiRequest } from "../../shared/hooks/useApiRequest";
import { expensesApi } from "../../lib/expensesApiClient";
import { expenseApi } from "../../features/expense/api/expenseApi";
import { MonthlySpendingWidget } from "./MonthlySpendingWidget";
import { BillChartWidget } from "./BillChartWidget";
import { BudgetWidget } from "./BudgetWidget";
import { WelcomeWidget } from "./WelcomeWidget";
import { NextMarketListWidget } from "./NextMarketListWidget";

function Overview() {
    const { api } = React.useContext(AppContext);
    const { request } = useApiRequest(api);

    const { request: requestExpenses } = useApiRequest(expensesApi);

    const [dataBillsByMonth, setDataBillsByMonth] = useState([]);
    const [dataExpensesByMonth, setDataExpensesByMonth] = useState([]);
    const [lists, setLists] = useState();

    useEffect(() => {
        request((client) => client.get(`/bills/byMonth`))
            .then((response) => {
                setDataBillsByMonth(response.data);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        requestExpenses((client) => expenseApi.totalByMonth(client, "COP"), { errorTitle: "Could not load expenses" })
            .then((response) => {
                setDataExpensesByMonth(response.data);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        request((client) => client.get(`/market-list`))
            .then((response) => {
                setLists(
                    response.data.map((list, index) => {
                        list.completedStatus = (list.completedItems / list.totalItems) * 100;
                        list.date = new Date(list.date);
                        return list;
                    })
                );
            })
            .catch(() => {});
    }, []);

    return (
        <Row>
            <Col md={12} className="welcome mt-2 mb-5 px-5 text-center">
                <WelcomeWidget />
            </Col>
            <Col md={6}>
                <Row>
                    <Col xs={6} className="mb-3">
                        <BudgetWidget data={dataBillsByMonth} />
                    </Col>
                    <Col xs={6} className="mb-3">
                        <NextMarketListWidget nextMarketList={lists ? lists.at(0) : null} />
                    </Col>
                    <Col xs={12} className="mb-3">
                        <MonthlySpendingWidget billsData={dataBillsByMonth} expensesData={dataExpensesByMonth} />
                    </Col>
                    <Col xs={12} className="mb-3">
                        <BillChartWidget data={dataBillsByMonth} />
                    </Col>
                </Row>
            </Col>
            <Col md={6}>
                <MarketListWidget data={lists} />
            </Col>
        </Row>
    );
}

export { Overview };
