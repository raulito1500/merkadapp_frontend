import React, { useState } from "react";
import { MarketListWidget } from "../MarketList/Widget";
import { Card, Col, Row } from "react-bootstrap";
import { useUtilities } from "../../App/Context/utilities";
import { AppContext } from "../../App/Context/app";
import moment from "moment";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

function Overview() {

    const utilities = useUtilities();

    const {
        api,
        setLoading,
        pushNotifications
    } = React.useContext(AppContext);

    const [data, setData] = React.useState([]);
    const [chartData, setChartData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Total",
                data: [0, 0, 0, 0, 0, 0],

            }
        ]
    });
    const [chartOptions, setChartOptions] = useState({
        responsive: true,
        elements: {
            point: {
                radius: 2,
                backgroundColor: "#ff5500"
            },
            line: {
                tension: 0.4,
                backgroundColor: "rgb(255 85 0 / 30%)",
                borderColor: "#ff5500",
                borderWidth: 1,
                fill: "start",
            }
        },
        scales: {
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    callback: function (value) {
                        let interval = value / 1000000;
                        if (interval >= 1) return `${interval}M`;
                        interval = value / 1000;
                        if (interval >= 1) return `${interval}k`;
                        return value;
                    }
                },
                title: {
                    display: false,
                }
            },
            x: {
                grid: {
                    display: false,
                },
            }
        },
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            }
        }
    });
    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/bills/byMonth`)
            .then((response) => {
                let newData = response.data;
                newData[0].total = isNaN(newData[0].total) ? 0 : newData[0].total;
                newData[1].total = isNaN(newData[1].total) ? 0 : newData[1].total;
                newData[0].variation = calculateVariation(newData);
                setData(newData);
                setUpChartInfo(newData);
            })
            .catch(error => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    const calculateVariation = (data) => {
        if (data[0].total === 0 && data[1].total === 0) {
            return 0;
        }
        if (data[1].total === 0) {
            return 100;
        }
        if (data[0].total === 0) {
            return -100;
        }
        return ((data[0].total - data[1].total) / data[1].total) * 100;
    }

    const setUpChartInfo = (info) => {
        let sortedInfo = info;
        setChartData({
            labels: sortedInfo.map(item => moment(new Date(1, item.month - 1, 1)).format('MMM')),
            datasets: [
                {
                    label: "Total spent",
                    data: sortedInfo.map(item => item.total),
                    borderColor: "#ff5500",
                }
            ]
        })
    }
    return (
        <Row>
            <Col md={12} className="welcome mt-2 mb-5 px-5 text-center">
                <h1 className="m-0">Hi, Raúl!</h1>
                <p className="m-0">Are you ready to start saving?</p>

            </Col>
            <Col md={6}>
                <Row >
                    {data.length > 0 ?
                        <Col xs={6} className="mb-3">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <h6 className="fw-normal text-muted mt-0 mb-3">Budget</h6>
                                    <div className="d-flex">
                                        <div className="feature-icon card-highlight">
                                            <i className="bi bi-graph-up-arrow"></i>
                                        </div>
                                        <div className="ps-2">
                                            <h3 className="mt-1 mb-0">{utilities.formatMoney(data[0].total)}</h3>
                                            <p className="text-muted mb-0">
                                                <span className={"mb-2 d-block fw-bold " + (data[0].variation < 0 ? "text-success" : "text-danger")}>
                                                    <i className={"bi " + (data[0].variation < 0 ? "bi-arrow-down-right " : "bi-arrow-up-right")}></i> {utilities.formatPercent(data[0].variation)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-muted text-nowrap">{moment(new Date(1, data[0].month - 1, 1)).format('MMMM')}</span>
                                </Card.Body>
                            </Card>
                        </Col>
                        : ""}
                    <Col xs={6} className="mb-3">
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <h6 className="fw-normal text-muted mt-0 mb-3">Next market list</h6>
                                <Col xs={12} className="d-flex justify-content-start align-items-center">
                                    <div className="progress-circle rounded-circle d-flex align-items-center justify-content-center" style={{ "--progress": 50 }}>
                                        <div className="progress-content rounded-circle d-inline-flex align-items-center justify-content-center bg-white">
                                            <i className="bi bi-basket fs-2"></i>
                                        </div>
                                    </div>
                                    <span className="d-flex flex-grow-1 flex-column ms-3">
                                        <strong>{moment('2025-12-12').format('MMM Do')}</strong>
                                        <small className="text-body-secondary">{5} items</small>
                                    </span>
                                </Col>
                                <Col xs={12} className="d-flex justify-content-start align-items-center">
                                    <span className="d-flex flex-grow-1 flex-column ms-3 text-body-secondary text-end">
                                        <strong className="text-primary">{utilities.formatMoney(400000)}</strong>
                                        <small>Estimated value</small>
                                    </span>
                                    <i className="bi bi-arrow-right-circle text-primary ms-3 fs-2"></i>
                                </Col>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} className="mb-3">
                        <Card className="shadow-sm h-100">
                            <Card.Body className="">
                                <h6 className="fw-normal text-muted ">Last 6 month</h6>
                                <Line
                                    data={chartData}
                                    options={chartOptions}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col md={6} >
                <MarketListWidget />
            </Col>
        </Row>
    )
}

export { Overview }