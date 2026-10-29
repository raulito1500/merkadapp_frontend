import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useParams } from "react-router-dom";
import { GROUP_CATEGORIES } from "../../../shared/constants/constants";
import PageTitle from "../../../shared/components/PageTitle";
import { useGroupForm } from "../hooks/useGroupForm";

function GroupForm() {
    const { groupId } = useParams();
    const { name, setName, category, setCategory, selectedMembers, setSelectedMembers, options, handleSubmit } =
        useGroupForm(groupId);

    return (
        <>
            <PageTitle>{groupId ? "Edit group" : "Create group"}</PageTitle>
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
                            {groupId ? "Save changes" : "Create group"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}

export { GroupForm };
