import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import { expensesApi } from "../../../App/Context/expensesApi";
import PageTitle from "../../../components/PageTitle";

function GroupCreate() {
    const navigate = useNavigate();
    const { setLoading, pushNotifications } = React.useContext(AppContext);
    const [name, setName] = React.useState("");
    const [members, setMembers] = React.useState([]);

    const handleMembersChange = (selected) => {
        setMembers(selected.map((option) => (typeof option === "string" ? option : option.label)));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        expensesApi
            .post("/groups", { name, members })
            .then((response) => navigate(`/expenses/${response.data._id}`))
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <PageTitle>Create group</PageTitle>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Group name</Form.Label>
                            <Form.Control
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Members</Form.Label>
                            <Typeahead
                                id="group_members"
                                multiple
                                allowNew
                                options={[]}
                                selected={members}
                                onChange={handleMembersChange}
                                newSelectionPrefix="Add member: "
                                placeholder="Enter a name and press enter"
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="text-white">
                            Create group
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}

export { GroupCreate };
