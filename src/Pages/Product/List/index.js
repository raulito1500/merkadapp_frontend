import React from "react";
import { AppContext } from "../../../App/Context/app";
import { Badge, ButtonGroup, Col, ListGroup, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BillHistory } from "../BillHistory";
import { CATEGORIES } from "../../../Constants/constants";
import { ProductRecommendations } from "../ProductRecommendations";
import DataViewOptions from "../../../components/DataViewOptions";
import moment from "moment";
import { formatRepeat, formatMoney, formatPercent } from "../../../utils/formatting";
import { searchBy } from "../../../utils/searching";
import { sortBy } from "../../../utils/sorting";
import { groupBy } from "../../../utils/grouping";
import PageTitle from "../../../components/PageTitle";

function ProductList() {
    const { api, setLoading, pushNotifications, show, setShow } = React.useContext(AppContext);

    const [list, setList] = React.useState();
    const [listGrouped, setListGrouped] = React.useState([]);

    const [product, setProduct] = React.useState();

    const DEFAULT_SCREEN_SETTINGS = {
        search: "",
        sort: "ASC",
        group: "CATEGORY",
    };

    const handleClose = () => setShow(false);
    const handleShow = (product) => {
        setProduct(product);
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
                                <Badge className="list-group-title" bg="secondary">
                                    {CATEGORIES[category]
                                        ? CATEGORIES[category].label
                                        : formatRepeat(category)}
                                </Badge>
                                <ListGroup>
                                    {listGrouped[category].map((item, index) => (
                                        <ListGroup.Item
                                            as="label"
                                            key={item.id}
                                            className="d-flex gap-3 align-items-start px-3 py-4 my-2 border border-1 rounded-4 shadow-sm"
                                        >
                                            <img
                                                width="80"
                                                height="80"
                                                className="border border-0 rounded-4 flex-shrink-0"
                                                alt={item.name}
                                                src="image_product_grey.png"
                                            />
                                            <div className="d-flex flex-column gap-2 flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <h5>{item.name}</h5>
                                                    <small className="text-muted text-end">
                                                        {formatRepeat(item.repeat)}
                                                    </small>
                                                </div>
                                                <div>

                                                    {item.last_date ? (
                                                        <div className="text-muted">
                                                            Last purchase at <strong className="text-body">{item.last_where}</strong> for
                                                            <strong className="text-primary"> {formatMoney(item.last_value)}</strong>,{" "}
                                                            {moment(item.last_date).fromNow()}
                                                        </div>
                                                    ) : (
                                                        <div className="text-muted">No purchase history yet</div>
                                                    )}

                                                </div>
                                                <div className="d-flex justify-content-between align-items-end">
                                                    {item.trend_percent != null && (
                                                        item.trend_percent === 0 ? (
                                                            <div className={`p-2 border-0 rounded-3 small bg-body-secondary text-body-secondary`}>
                                                                Neutral trend (0,0%)
                                                            </div>
                                                        ) : (
                                                            <div className={`p-2 border-0 rounded-3 small ${item.trend_percent > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                                                                <i className={`bi ${item.trend_percent > 0 ? "bi-graph-up-arrow" : "bi-graph-down-arrow"}`}></i>
                                                                {item.trend_percent > 0 ? "Upward" : "Downward"} trend of <strong>{formatPercent(Math.abs(item.trend_percent))}</strong>
                                                            </div>
                                                        )
                                                    )}
                                                    <ButtonGroup className="ms-auto flex-shrink-0">
                                                        <Link
                                                            className="btn btn-outline-primary"
                                                            onClick={() => handleShow(item)}
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
                    <BillHistory product={product} />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export { ProductList };
