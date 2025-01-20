import React, { useEffect, useState } from "react";
import { MarketListWidget } from "../MarketList/Widget";
import { Col, Row } from "react-bootstrap";
import { AppContext } from "../../App/Context/app";
import { BillChartWidget } from "./BillChartWidget";
import { BudgetWidget } from "./BudgetWidget";
import { WelcomeWidget } from "./WelcomeWidget";
import { NextMarketListWidget } from "./NextMarketListWidget";

function Overview() {

    const {
        api,
        setLoading,
        pushNotifications
    } = React.useContext(AppContext);

    const [dataBillsByMonth, setDataBillsByMonth] = useState([]);
    const [lists, setLists] = useState();


    useEffect(() => {
        setLoading(true);
        api
            .get(`/bills/byMonth`)
            .then((response) => {
                setDataBillsByMonth(response.data);
            })
            .catch(error => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        api
            .get(`/market-list`)
            .then((response) => {
                setLists(
                    response.data.map((list, index) => {
                        list.completedStatus = (list.completedItems / list.totalItems) * 100;
                        list.date = new Date(list.date);
                        return list;
                    })
                );
            })
            .catch(error => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Row>
            <Col md={12} className="welcome mt-2 mb-5 px-5 text-center">
                <WelcomeWidget
                />
            </Col>
            <Col md={6}>
                <Row >
                    <Col xs={6} className="mb-3">
                        <BudgetWidget
                            data={dataBillsByMonth} />
                    </Col>
                    <Col xs={6} className="mb-3">
                        <NextMarketListWidget
                            nextMarketList={lists ? lists.at(0) : null} />
                    </Col>
                    <Col xs={12} className="mb-3">
                        <BillChartWidget
                            data={dataBillsByMonth} />
                    </Col>
                </Row>
            </Col>
            <Col md={6} >
                <MarketListWidget
                    data={lists} />
            </Col>
        </Row>
    )
}

export { Overview }