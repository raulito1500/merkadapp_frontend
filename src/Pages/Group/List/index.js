import React from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import { useAuth } from "../../../App/Context/auth";
import { expensesApi } from "../../../App/Context/expensesApi";
import PageTitle from "../../../components/PageTitle";

function GroupList() {
    const auth = useAuth();
    const { setLoading, pushNotifications } = React.useContext(AppContext);
    const [groups, setGroups] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        expensesApi
            .get("/groups", { params: { owner: auth.user } })
            .then((response) => setGroups(response.data))
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <PageTitle>Expenses</PageTitle>
            <Row className="px-2">
                <Col xs={6} sm={4} md={3}>
                    <Link to="personal" className="text-decoration-none">
                        <Card className="shadow-sm mb-3">
                            <Card.Body>
                                <h3 className="fs-5 mb-0">
                                    <i className="bi bi-lock text-primary"></i> Personal
                                </h3>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
            <Card className="my-3">
                <Card.Body className="py-2 d-flex justify-content-between align-items-center">
                    <span>Groups</span>
                    <Link to="create" className="btn btn-primary text-white btn-sm">
                        Create group
                    </Link>
                </Card.Body>
            </Card>
            <ListGroup>
                {groups.length === 0 && (
                    <ListGroup.Item>
                        <span className="text-muted">You don't belong to any group yet</span>
                    </ListGroup.Item>
                )}
                {groups.map((group) => (
                    <ListGroup.Item key={group._id} as={Link} to={group._id} action>
                        <strong>{group.name}</strong>
                        <span className="text-muted d-block">
                            {group.members.length} member{group.members.length !== 1 && "s"}
                        </span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}

export { GroupList };
