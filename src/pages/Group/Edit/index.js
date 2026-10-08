import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate, useParams } from "react-router-dom";
import { expensesApi } from "../../../lib/expensesApiClient";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { GROUP_CATEGORIES } from "../../../shared/constants/constants";
import PageTitle from "../../../shared/components/PageTitle";
import { displayNameOf } from "../../../shared/utils/userDisplay";

function GroupEdit() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { request } = useApiRequest(expensesApi);
    const [name, setName] = React.useState("");
    const [category, setCategory] = React.useState("OTHER");
    const [selectedMembers, setSelectedMembers] = React.useState([]);
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {
        request(() => Promise.all([expensesApi.get(`/groups/${groupId}`), expensesApi.get("/users")]))
            .then(([groupResponse, usersResponse]) => {
                const group = groupResponse.data;
                setName(group.name);
                setCategory(group.category ?? "OTHER");
                setSelectedMembers(
                    group.members.map((member) => ({ label: displayNameOf(member), uid: member.uid }))
                );
                setOptions(usersResponse.data.map((user) => ({ label: displayNameOf(user), uid: user.uid })));
            })
            .catch(() => {});
    }, [groupId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const members = selectedMembers.map((option) =>
            typeof option === "string" ? option : option.uid ?? option.label
        );
        request((client) => client.patch(`/groups/${groupId}`, { name, category, members }))
            .then(() => navigate(`/expenses/${groupId}`))
            .catch(() => {});
    };

    return (
        <>
            <PageTitle>Edit group</PageTitle>
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
                            <Form.Label>Category</Form.Label>
                            <Form.Select value={category} onChange={(event) => setCategory(event.target.value)}>
                                {Object.entries(GROUP_CATEGORIES).map(([key, { label }]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Members</Form.Label>
                            <Typeahead
                                id="group_members"
                                multiple
                                allowNew
                                options={options}
                                selected={selectedMembers}
                                onChange={setSelectedMembers}
                                newSelectionPrefix="Add member: "
                                placeholder="Search a user or type a new member's name"
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="text-white">
                            Save changes
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}

export { GroupEdit };
