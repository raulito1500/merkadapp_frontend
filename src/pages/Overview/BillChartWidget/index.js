import React, { useEffect, useState } from "react";
import moment from "moment";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale);

const chartOptions = {
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
};

function BillChartWidget({ data }) {

    const [chartData, setChartData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Total",
                data: [0, 0, 0, 0, 0, 0],

            }
        ]
    });

    useEffect(() => {
        if (data && data.length > 0) {
            setChartData({
                labels: data.map(item => moment(item.date).format('MMM')),
                datasets: [
                    {
                        label: "Total spent",
                        data: data.map(item => item.total),
                        borderColor: "#ff5500",
                    }
                ]
            })
        }
    }, [data]);

    return (
        <Card className="shadow-sm h-100">
            <Card.Body className="">
                <h6 className="fw-normal text-muted ">Last 6 month</h6>
                <Line
                    data={chartData}
                    options={chartOptions}
                />
            </Card.Body>
        </Card>
    )
}

export { BillChartWidget }