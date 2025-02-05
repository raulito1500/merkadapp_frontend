import React from "react";
import { Badge, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { AppContext } from "../../../App/Context/app";
import { CATEGORIES } from "../../../Constants/constants";
import DataViewOptions from "../../../components/DataViewOptions";
import { searchBy } from "../../../utils/searching";
import { groupBy, groupByChecked, groupBySuggestedPlace } from "../../../utils/grouping";
import { sortBy } from "../../../utils/sorting";
import { formatMoney } from "../../../utils/formatting";

export const calculateSummaryInfo = (data) => {
    data.completedItems = data.items.filter((item) => !!item.checked).length;
    data.totalItems = data.items.length;
    data.completedStatus = (data.completedItems / data.totalItems) * 100;
    data.estimated = data.items.reduce((total, item) => total + item.value, 0);
};

function MarketListView() {
    const { id } = useParams();

    const { api, setLoading, pushNotifications } = React.useContext(AppContext);

    const [list, setList] = React.useState();
    const [listGrouped, setListGrouped] = React.useState();

    const DEFAULT_SCREEN_SETTINGS = {
        search: "",
        sort: "ASC",
        group: "STATUS",
    };
    const GROUP_OPTIONS = [
        { key: "STATUS", label: "By status" },
        { key: "CATEGORY", label: "By category" },
        { key: "PLACE", label: "By suggested place" },
    ];

    React.useEffect(() => {
        setLoading(true);
        api.get(`/market-list/${id}`)
            .then((response) => {
                const data = response.data;
                calculateSummaryInfo(data);
                setList(data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleDataViewOptionsChange = (screenSettings) => {
        if (!list) {
            return;
        }
        let dataGr = {};
        if (screenSettings.group === "STATUS") {
            dataGr = groupByChecked(list.items);
        } else if (screenSettings.group === "CATEGORY") {
            dataGr = groupBy("category", list.items);
            setListGrouped(dataGr);
        } else if (screenSettings.group === "PLACE") {
            dataGr = groupBySuggestedPlace(list.items);
            setListGrouped(dataGr);
        }
        for (let index in dataGr) {
            dataGr[index] = sortBy("product_name", dataGr[index], screenSettings.sort);
            dataGr[index] = searchBy("product_name", dataGr[index], screenSettings.search);
        }
        setListGrouped(dataGr);
    };

    React.useEffect(() => {
        handleDataViewOptionsChange(DEFAULT_SCREEN_SETTINGS);
    }, [list]);

    const checkItem = (event, idItem) => {
        const index = list.items.findIndex((item) => item.id === idItem);
        setLoading(true);
        api.put(`/market-list/${list.id}/check/${list.items[index].id}`)
            .then((response) => {
                const updatedList = {
                    ...list,
                    items: list.items.map((item, idx) => (idx === index ? { ...item, checked: true } : item)),
                };
                setList(updatedList);
            })
            .catch((error) => {
                pushNotifications("¡Ups! We have an error", error, "error");
            })
            .finally(() => setLoading(false));
    };

    if (!list) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>
                <Link to="/">
                    <i className="bi bi-arrow-left fs-5"></i>
                </Link>
                Market list
            </h1>
            {list && (
                <Container>
                    <Row>
                        <Col md={12} className="px-0 px-md-2">
                            <DataViewOptions
                                onDataViewOptionsChange={handleDataViewOptionsChange}
                                GROUP_OPTIONS={GROUP_OPTIONS}
                                DEFAULT_SCREEN_SETTINGS={DEFAULT_SCREEN_SETTINGS}
                            />
                        </Col>
                        <Col md={5} lg={4} className="px-0 px-md-2 mb-3">
                            <Card>
                                <Card.Body>
                                    <Col
                                        key={list.id}
                                        xs={12}
                                        className="mb-0 py-1 d-flex justify-content-start align-items-center"
                                    >
                                        <div
                                            className="progress-circle rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ "--progress": list.completedStatus }}
                                        >
                                            <div className="progress-content rounded-circle d-inline-flex align-items-center justify-content-center bg-white">
                                                <i className="bi bi-basket fs-2 p-0"></i>
                                            </div>
                                        </div>
                                        <span className="d-flex flex-grow-1 flex-column ms-3">
                                            <strong>{moment(list.date).format("MMM Do")}</strong>
                                            <small className="text-body-secondary">
                                                {list.totalItems} items
                                            </small>
                                        </span>
                                        <span className="d-flex flex-grow-1 flex-column ms-3 text-body-secondary text-end">
                                            <strong className="text-primary">
                                                {formatMoney(list.estimated)}
                                            </strong>
                                            <small>Estimated value</small>
                                        </span>
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={7} lg={8} className="px-0 px-md-2 position-relative">
                            {listGrouped &&
                                Object.keys(listGrouped).map((title, index) => (
                                    <>
                                        {listGrouped[title] && listGrouped[title].length > 0 && (
                                            <>
                                                <Badge className="list-group-title ms-3" bg="secondary">
                                                    {CATEGORIES[title] ? CATEGORIES[title].label : title}
                                                </Badge>
                                                <ListGroup key={index} className="mb-4">
                                                    {listGrouped[title].map((item, index) => (
                                                        <ListGroup.Item
                                                            as="span"
                                                            key={item.id}
                                                            className="d-flex gap-3 align-items-center py-3"
                                                        >
                                                            <div className="pt-1 form-checked-content flex-grow-1">
                                                                {item.quantity}
                                                                <strong className="ms-1">
                                                                    {item.product_name}
                                                                </strong>
                                                                {item.where !== "" && item.value !== 0 ? (
                                                                    <span className="d-block pt-1 flex-fill justify-content-start justify-content-sm-start">
                                                                        <small className="me-3 text-body-secondary">
                                                                            <i className="text-primary me-0 bi bi-shop-window"></i>
                                                                            {item.where}
                                                                        </small>
                                                                        <small className="me-3 px-3 border-start border-end text-body-secondary">
                                                                            <i className="text-primary me-0 bi bi-wallet2"></i>
                                                                            {formatMoney(item.value)}
                                                                        </small>
                                                                        <small className="me-3 text-body-secondary">
                                                                            <i className="text-primary bi bi-calendar-event"></i>
                                                                            {moment(item.date).format(
                                                                                "MMM D"
                                                                            )}
                                                                        </small>
                                                                    </span>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                            <input
                                                                className="form-check-input fs-4"
                                                                type="checkbox"
                                                                disabled={item.checked}
                                                                checked={item.checked}
                                                                onChange={(event) =>
                                                                    checkItem(event, item.id)
                                                                }
                                                            />
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </>
                                        )}
                                    </>
                                ))}
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    );
}

export default MarketListView;
