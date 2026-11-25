import React, { useMemo } from "react";
import moment from "moment";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { mergeMonthlySeries } from "../../../shared/utils/grouping";

Chart.register(CategoryScale);

const BILLS_COLOR = "#ff5500";
const EXPENSES_COLOR = "#004921";

const chartOptions = {
    responsive: true,
    elements: {
        point: { radius: 2 },
        line: { tension: 0.4, borderWidth: 1, fill: "start" },
    },
    scales: {
        y: {
            grid: { display: false },
            ticks: {
                callback: function (value) {
                    let interval = value / 1000000;
                    if (interval >= 1) return `${interval}M`;
                    interval = value / 1000;
                    if (interval >= 1) return `${interval}k`;
                    return value;
                },
            },
            title: { display: false },
        },
        x: { grid: { display: false } },
    },
    plugins: { title: { display: false }, legend: { display: true } },
};

function MonthlySpendingWidget({ billsData = [], expensesData = [] }) {
    const chartData = useMemo(() => {
        const { months, series } = mergeMonthlySeries([billsData, expensesData]);
        return {
            labels: months.map((month) => moment(month, "YYYY-MM").format("MMM")),
            datasets: [
                {
                    label: "Bills",
                    data: series[0],
                    borderColor: BILLS_COLOR,
                    backgroundColor: "rgb(255 85 0 / 30%)",
                    pointBackgroundColor: BILLS_COLOR,
                },
                {
                    label: "Expenses",
                    data: series[1],
                    borderColor: EXPENSES_COLOR,
                    backgroundColor: "rgb(0 73 33 / 25%)",
                    pointBackgroundColor: EXPENSES_COLOR,
                },
            ],
        };
    }, [billsData, expensesData]);

    return (
        <Card className="shadow-sm h-100">
            <Card.Body>
                <h6 className="fw-normal text-muted">Bills vs expenses · last 6 months</h6>
                <Line data={chartData} options={chartOptions} />
            </Card.Body>
        </Card>
    );
}

export { MonthlySpendingWidget };
