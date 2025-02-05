import React from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import moment from "moment";
import { AppContext } from "../../../App/Context/app";
import { formatMoney, formatUnits } from "../../../utils/formatting.js";

function BillHistory({ productId }) {
    const { api, setLoading, pushNotifications } = React.useContext(AppContext);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        api.get(`/products/${productId}/bill-items`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, [productId]);

    return (
        <>
            <h2>Purchase history</h2>
            {data.length > 0 ? (
                <Table size="sm">
                    <thead>
                        <tr>
                            <th>Purchase</th>
                            <th>Purchase place</th>
                            <th>Unit value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <strong>{moment(item.date).format("MMM Do, YYYY")}</strong>
                                    <br />
                                    <Link to={`/bills/edit/${item.bill_id}`}>{item.where}</Link>
                                </td>
                                <td>
                                    {item.description} {item.brand}
                                    <br />
                                    {item.quantity} x {formatUnits(item.content, item.unit)}
                                </td>
                                <td>
                                    <strong className="text-primary">{formatMoney(item.unit_value)}</strong>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ): (
                <p>No data available</p>
            )}
        </>
    );
}
export { BillHistory };
