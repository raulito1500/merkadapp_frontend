import React, { useReducer } from "react";
import PageTitle from "../../../components/PageTitle";
import DataViewOptions from "../../../components/DataViewOptions";
import { Typeahead } from "react-bootstrap-typeahead";
import { AppContext } from "../../../App/Context/app";
import { Card, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import MarketListDefaultItem from "../DefaultItem";

function CreateBlankMarketList() {
    const { api, setLoading, pushNotifications } = React.useContext(AppContext);
    const [products, setProducts] = React.useState();

    const ref = React.createRef();

    function reducer(state, action) {
        switch (action.type) {
            case "update_date":
                return {
                    ...state,
                    date: action.newDate,
                };
            case "add_item":
                if (action.products.length > 0) {
                    let newItems = [...state.items];
                    action?.products?.map(
                        (product, index) =>
                            (newItems = [
                                {
                                    product_id: product.customOption ? "" : product.id,
                                    product_name: product.name,
                                    quantity: 1,
                                    checked: true,
                                    category: product.customOption ? "" : product.category,
                                },
                                ...newItems,
                            ])
                    );
                    return {
                        ...state,
                        items: newItems,
                    };
                } else {
                    return state;
                }

            default:
                return state;
        }
    }
    const blankMarketList = {
        date: "2025-02-20",
        items: [],
    };
    const [marketList, setMarketList] = useReducer(reducer, blankMarketList);

    React.useEffect(() => {
        setLoading(true);
        api.get(`/products/true`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAddItem = (selected) => {
        setMarketList({ type: "add_item", products: selected });
        ref.current?.clear();
    };
    return (
        <div>
            <PageTitle>Create market list</PageTitle>
            <Card>
                <Card.Body>
                    <Form.Group className="col-12 col-sm-6 mb-2">
                        <Form.Label>When do you plan to buy?</Form.Label>
                        <Form.Control
                            value={marketList.date}
                            onChange={(event) => {
                                setMarketList({ type: "update_date", newDate: event.target.value });
                            }}
                            type="date"
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
            <ListGroup>
                <ListGroup.Item>
                    <Typeahead
                        id="product_list"
                        allowNew
                        onChange={handleAddItem}
                        newSelectionPrefix="Add a non-existing product: "
                        labelKey="name"
                        options={products}
                        ref={ref}
                        placeholder="Type to add products"
                    />
                </ListGroup.Item>
                {marketList.items.length === 0 && (
                    <ListGroup.Item>
                        <span>Start typing to add products</span>
                    </ListGroup.Item>
                )}
                {marketList.items.map((item, index) => (
                    <ListGroup.Item className="ps-2" key={index + item.product_id} as="div">
                        <MarketListDefaultItem item={item} />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default CreateBlankMarketList;
