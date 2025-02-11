import React from "react";
import { AppContext } from "../../../App/Context/app";
import { Badge, ButtonGroup, Col, ListGroup, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BillHistory } from "../BillHistory";
import { CATEGORIES } from "../../../Constants/constants";
import { ProductRecommendations } from "../ProductRecommendations";
import DataViewOptions from "../../../components/DataViewOptions";
import { formatRepeat } from "../../../utils/formatting";
import { searchBy } from "../../../utils/searching";
import { sortBy } from "../../../utils/sorting";
import { groupBy } from "../../../utils/grouping";
import PageTitle from "../../../components/PageTitle";

function ProductList() {
    const { api, setLoading, pushNotifications, show, setShow } = React.useContext(AppContext);

    const [list, setList] = React.useState();
    const [listGrouped, setListGrouped] = React.useState([]);

    const [productId, setProductId] = React.useState();

    const DEFAULT_SCREEN_SETTINGS = {
        search: "",
        sort: "ASC",
        group: "CATEGORY",
    };

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setProductId(id);
        setShow(true);
    };

    React.useEffect(() => {
        setLoading(true);
        api.get(`/products/true`)
            .then((response) => {
                setList(response.data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    React.useEffect(() => {
        handleDataViewOptionsChange(DEFAULT_SCREEN_SETTINGS);
    }, [list]);

    const handleDataViewOptionsChange = (screenSettings) => {
        if (!list) {
            return;
        }
        let dataGr = {};
        if (screenSettings.group === "CATEGORY") {
            dataGr = groupBy("category", list);
            setListGrouped(dataGr);
        } else if (screenSettings.group === "FREQUENCY") {
            dataGr = groupBy("repeat", list);
            setListGrouped(dataGr);
        }
        for (let index in dataGr) {
            dataGr[index] = sortBy("name", dataGr[index], screenSettings.sort);
            dataGr[index] = searchBy("name", dataGr[index], screenSettings.search);
        }
        setListGrouped(dataGr);
    };

    return (
        <>
            <PageTitle>Products list</PageTitle>
            <ProductRecommendations />
            <DataViewOptions
                onDataViewOptionsChange={handleDataViewOptionsChange}
                GROUP_OPTIONS={[
                    { key: "FREQUENCY", label: "By frequency" },
                    { key: "CATEGORY", label: "By category" },
                ]}
                DEFAULT_SCREEN_SETTINGS={DEFAULT_SCREEN_SETTINGS}
            />
            {listGrouped &&
                Object.keys(listGrouped).map((category, index) => (
                    <>
                        {listGrouped[category] && listGrouped[category].length > 0 && (
                            <Col key={category} className="position-relative">
                                <Badge className="list-group-title ms-3" bg="secondary">
                                    {CATEGORIES[category]
                                        ? CATEGORIES[category].label
                                        : formatRepeat(category)}
                                </Badge>
                                <ListGroup>
                                    {listGrouped[category].map((item, index) => (
                                        <ListGroup.Item
                                            as="label"
                                            key={item.id}
                                            className="d-flex gap-3 align-items-center px-3 py-4"
                                        >
                                            <img
                                                width="50"
                                                height="50"
                                                className=""
                                                alt="orange"
                                                src="image_fruit.png"
                                            />
                                            <div className="d-flex gap-3 justify-content-between w-100">
                                                <div>
                                                    <h5>{item.name}</h5>
                                                    <div>
                                                        Last purchase at <strong>Euro supermercado</strong>{" "}
                                                        for
                                                        <strong className="text-primary"> $41.990</strong>,
                                                        one month ago
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-graph-up-arrow text-primary"></i>
                                                        Upward trend of{" "}
                                                        <strong className="text-primary">15%</strong>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column justify-content-between">
                                                    <small className="text-muted text-end">
                                                        {formatRepeat(item.repeat)}
                                                    </small>
                                                    <ButtonGroup>
                                                        <Link
                                                            className="btn btn-outline-primary"
                                                            onClick={() => handleShow(item.id)}
                                                        >
                                                            <i className="bi bi-list pe-0"></i>
                                                        </Link>
                                                        <Link className="btn btn-outline-primary">
                                                            <i className="bi bi-pencil-square pe-0"></i>
                                                        </Link>
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Col>
                        )}
                    </>
                ))}
            <Offcanvas show={show} onHide={handleClose} placement="bottom">
                <Offcanvas.Body>
                    <BillHistory productId={productId} />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export { ProductList };
