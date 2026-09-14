import React from "react";
import { Link } from "react-router-dom";
import { Badge, Table } from "react-bootstrap";
import moment from "moment";
import { AppContext } from "../../../App/Context/app";
import { formatMoney, formatRepeat, formatUnits } from "../../../utils/formatting.js";
import { CATEGORIES } from "../../../Constants/constants.js";

function BillHistory({ product }) {
    const { api, setLoading, pushNotifications } = React.useContext(AppContext);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        api.get(`/products/${product.id}/bill-items`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, [product]);

    return (
        <>
            <h2>Purchase history</h2>
            <div className="mb-3 border bg-light-subtle rounded-4 p-3 d-flex gap-3 align-items-center overflow-hidden">
                <img
                    width="80"
                    height="80"
                    className="border border-0 rounded-4 flex-shrink-0"
                    alt={product.name}
                    src="image_product_grey.png"
                />
                <div className="d-flex flex-column gap-3 flex-grow-1 overflow-hidden">
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <Badge bg="success" className="">
                            {CATEGORIES[product.category]?.label || "Other"}
                        </Badge>
                        <span className="">
                            {formatRepeat(product.repeat)}
                        </span>
                    </div>
                    <strong className="">{product.name}</strong>
                </div>
                <div className="text-end flex-shrink-0">
                    <div className="text-secondary">Best price</div>
                    <strong className="text-success">
                        {formatMoney(data.sort((a, b) => a.unit_value - b.unit_value)[0]?.unit_value ?? 0)}
                    </strong>
                </div>
            </div>
            {data.length > 0 ? (
                <>
                    <div className="d-flex gap-1 mb-3">
                        <div className="border rounded-3 p-2 bg-secondary-subtle text-secondary">
                            Average: <strong>{formatMoney(data.reduce((acc, item) => acc + item.unit_value, 0) / data.length || 0)}</strong>
                        </div>
                        <div className="border rounded-3 p-2 bg-secondary-subtle text-secondary">
                            Last bought: <strong>{formatMoney(data[0].unit_value)}</strong>
                        </div>
                        <div className="border rounded-3 p-2 bg-secondary-subtle text-secondary">
                            Total purchases: <strong>{data.length}</strong>
                        </div>
                    </div>
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
                                        <span className="text-muted">{item.quantity} x {formatUnits(item.content, item.unit)}</span>
                                    </td>
                                    <td className="text-primary fw-bold text-end">
                                        <span>{formatMoney(item.unit_value)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table></>
            ) : (
                <p>No data available</p>
            )}
        </>
    );
}
export { BillHistory };
