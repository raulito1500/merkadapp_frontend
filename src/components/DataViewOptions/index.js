import React from "react";
import { Badge, Button, Card, Dropdown, Form, InputGroup } from "react-bootstrap";

const DataViewOptions = ({
    onDataViewOptionsChange,
    GROUP_OPTIONS = ["CATEGORY"],
    DEFAULT_SCREEN_SETTINGS = {
        search: "",
        sort: "ASC",
        group: "CATEGORY",
    },
}) => {
    const [screenSettings, setScreenSettings] = React.useState(DEFAULT_SCREEN_SETTINGS);

    const handleSearchChange = (event) => {
        const newScreenSettings = {
            ...screenSettings,
            search: event.target.value,
        };
        setScreenSettings(newScreenSettings);
        onDataViewOptionsChange(newScreenSettings);
    };

    const handleSortChange = () => {
        const newScreenSettings = {
            ...screenSettings,
            sort: screenSettings.sort === "ASC" ? "DESC" : "ASC",
        };
        setScreenSettings(newScreenSettings);
        onDataViewOptionsChange(newScreenSettings);
    };

    const handleGroupChange = (option) => {
        const newScreenSettings = {
            ...screenSettings,
            group: option,
        };
        setScreenSettings(newScreenSettings);
        onDataViewOptionsChange(newScreenSettings);
    };

    return (
        <Card className="my-3">
            <Card.Body className="py-2">
                <InputGroup>
                    <InputGroup.Text className="border-0 bg-transparent">
                        <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                        className="border-0"
                        placeholder="Apple, Oil, Soap"
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
                                screenSettings.sort === "ASC" ? "bi bi-sort-up" : "bi bi-sort-down-alt"
                            }
                        ></i>
                        {screenSettings.sort !== DEFAULT_SCREEN_SETTINGS.sort && (
                            <Badge
                                className="position-absolute top-50 translate-middle-x rounded-circle p-1"
                                bg="secondary"
                            >
                                <span className="visually-hidden">sorting settings applied</span>
                            </Badge>
                        )}
                    </Button>
                    <Dropdown>
                        <Dropdown.Toggle bsPrefix="text-secondary" variant="link">
                            <i className="bi bi-collection"></i>
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
    );
};

export default DataViewOptions;
