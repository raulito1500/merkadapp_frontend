import React from "react";
import { AppContext } from "../../../App/Context/app";
import { ListGroup, Row } from "react-bootstrap";

function ProductList() {
    const { api, setLoading, pushNotifications } = React.useContext(AppContext);
    const [listGrouped, setListGrouped] = React.useState([]);

    const groupProductByCategory = (products) => {
        return products.reduce((grouped, product) => {
            if (!grouped[product.category]) {
                grouped[product.category] = [];
            }
            grouped[product.category].push(product);
            return grouped;
        }, {});
    };

    React.useEffect(() => {
        setLoading(true);
        api.get(`/products/true`)
            .then((response) => {
                const data = groupProductByCategory(response.data);
                setListGrouped(data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);
    return (
        <>
            <h2>Product list</h2>
            <hr />
            {Object.keys(listGrouped).map((category, index) => (
                <Row className="px-2">
                    <h3>{category}</h3>
                    <ListGroup className="px-2">
                        {listGrouped[category].map((item, index) => (
                            <ListGroup.Item
                                as="label"
                                key={item.id}
                                className="">
                                <span>{item.name}</span>
                            </ListGroup.Item>
                        ))
                        }
                    </ListGroup>
                </Row>
            ))}
        </>
    )
}

export { ProductList }