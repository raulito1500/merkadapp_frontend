import React from "react";
import { AppContext } from "../../../App/Context/app";
import { Table } from "react-bootstrap";
import moment from "moment";
import { formatMoney } from "../../../utils/formatting.js";

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
            {data && (
                <Table size="sm">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Purchase place</th>
                            <th>Unit value</th>
                            <th>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td>{moment(item.date).format("MMM Do, YYYY")}</td>
                                <td>{item.where}</td>
                                <td>
                                    <strong className="text-primary">{formatMoney(item.unit_value)}</strong>
                                </td>
                                <td>
                                    {item.content} {item.unit}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}
export { BillHistory };
