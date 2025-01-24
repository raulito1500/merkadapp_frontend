import React from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Dropdown,
    Form,
    InputGroup,
    ListGroup,
    Row,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import moment from "moment";
import { CATEGORIES } from "../../../Constants/constants";
import { formatMoney } from "../../../utils/formatting";

const calculateSummaryInfo = (data) => {
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
    const [screenSettings, setScreenSettings] = React.useState(DEFAULT_SCREEN_SETTINGS);

    const groupByChecked = (data) => {
        const grouped = {
            UNCHECKED: [],
            CHECKED: [],
        };
        data.items.forEach((item) => {
            const checkedStatus = item.checked ? "CHECKED" : "UNCHECKED";
            grouped[checkedStatus].push(item);
        });
        return grouped;
    };

    const groupBySuggestedPlace = (data) => {
        const grouped = {
            UNSUGGESTED: [],
        };
        return data.items.reduce((grouped, item) => {
            const where = item.where === "" ? "UNSUGGESTED" : item.where;
            if (!grouped[where]) {
                grouped[where] = [];
            }
            grouped[where].push(item);
            return grouped;
        }, {});
    };

    const groupByCategory = (data) => {
        return data.items.reduce((grouped, item) => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
            return grouped;
        }, {});
    };

    const sortByProductName = (items, order = "ASC") => {
        return [...items].sort((a, b) => {
            const nameA = a.product_name.toLowerCase();
            const nameB = b.product_name.toLowerCase();

            if (nameA < nameB) {
                return order === "ASC" ? -1 : 1;
            }
            if (nameA > nameB) {
                return order === "ASC" ? 1 : -1;
            }
            return 0;
        });
    };

    const searchByProductName = (items, search) => {
        if (search === "") {
            return items;
        }
        search = search
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        return items.filter((item) =>
            item.product_name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(search)
        );
    };

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

    React.useEffect(() => {
        if (!list) {
            return;
        }
        let dataGr = {};
        if (screenSettings.group === "STATUS") {
            dataGr = groupByChecked(list);
        } else if (screenSettings.group === "CATEGORY") {
            dataGr = groupByCategory(list);
            setListGrouped(dataGr);
        } else if (screenSettings.group === "PLACE") {
            dataGr = groupBySuggestedPlace(list);
            setListGrouped(dataGr);
        }
        for (let index in dataGr) {
            dataGr[index] = sortByProductName(dataGr[index], screenSettings.sort);
            dataGr[index] = searchByProductName(dataGr[index], screenSettings.search);
        }
        setListGrouped(dataGr);
    }, [list, screenSettings]);

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

    const handleGroupChange = (option) => {
        setScreenSettings((prevSettings) => ({
            ...prevSettings,
            group: option,
        }));
    };

    const handleSortChange = () => {
        setScreenSettings((prevSettings) => ({
            ...prevSettings,
            sort: prevSettings.sort === "ASC" ? "DESC" : "ASC",
        }));
    };

    const handleSearchChange = (event) => {
        setScreenSettings((prevSettings) => ({
            ...prevSettings,
            search: event.target.value,
        }));
    };

    if (!list) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>
                <Link to="/">
                    <i className="bi bi-arrow-left fs-5"></i>
                </Link>{" "}
                Market list
            </h1>
            {list && (
                <Container>
                    <Row>
                        <Col md={12} className="px-0 px-md-2">
                            <Card className="my-3">
                                <Card.Body className="py-2">
                                    <InputGroup>
                                        <InputGroup.Text className="border-0 bg-transparent">
                                            <i className="bi bi-search"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            className="border-0"
                                            placeholder="Apple, Lettuce, Rice"
                                            value={screenSettings.search}
                                            onChange={handleSearchChange}
                                        />
                                        <Button
                                            className={
                                                screenSettings.sort === DEFAULT_SCREEN_SETTINGS.sort
                                                    ? "text-black"
                                                    : "text-secondary"
                                            }
                                            variant="link"
                                            onClick={handleSortChange}
                                        >
                                            <i
                                                className={
                                                    screenSettings.sort === "ASC"
                                                        ? "bi bi-sort-up"
                                                        : "bi bi-sort-down-alt"
                                                }
                                            ></i>
                                            {screenSettings.sort !== DEFAULT_SCREEN_SETTINGS.sort && (
                                                <Badge
                                                    className="position-absolute top-50 translate-middle-x rounded-circle p-1"
                                                    bg="secondary"
                                                >
                                                    <span className="visually-hidden">
                                                        sorting settings applied
                                                    </span>
                                                </Badge>
                                            )}
                                        </Button>
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                bsPrefix={
                                                    screenSettings.group === DEFAULT_SCREEN_SETTINGS.group
                                                        ? "text-black"
                                                        : "text-secondary"
                                                }
                                                variant="link"
                                                className="position-relative"
                                            >
                                                <i className="bi bi-collection"></i>
                                                {screenSettings.group !== DEFAULT_SCREEN_SETTINGS.group && (
                                                    <Badge
                                                        className="position-absolute top-50 translate-middle-x rounded-circle p-1"
                                                        bg="secondary"
                                                    >
                                                        <span className="visually-hidden">
                                                            grouping by settings applied
                                                        </span>
                                                    </Badge>
                                                )}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {GROUP_OPTIONS.map((option, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={() => handleGroupChange(option.key)}
                                                        className={option.key === screenSettings.group ? "active" : ""}
                                                    >
                                                        {option.label}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </InputGroup>
                                </Card.Body>
                            </Card>
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
                                                <i className="bi bi-basket fs-2"></i>
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
                                        <Badge className="list-group-title ms-3" bg="secondary">
                                            {CATEGORIES[title] ? CATEGORIES[title].label : title}
                                        </Badge>
                                        {listGrouped[title] && (
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
                                                                        <i className="text-primary me-0 bi bi-shop-window"></i>{" "}
                                                                        {item.where}
                                                                    </small>
                                                                    <small className="me-3 px-3 border-start border-end text-body-secondary">
                                                                        <i className="text-primary me-0 bi bi-wallet2"></i>{" "}
                                                                        {formatMoney(item.value)}
                                                                    </small>
                                                                    <small className="me-3 text-body-secondary">
                                                                        <i className="text-primary bi bi-calendar-event"></i>{" "}
                                                                        {moment(item.date).format("MMM D")}
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
                                                            onChange={(event) => checkItem(event, item.id)}
                                                        />
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
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

export { MarketListView };
