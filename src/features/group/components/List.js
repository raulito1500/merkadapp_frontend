import React from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GROUP_CATEGORIES } from "../../../shared/constants/constants";
import PageTitle from "../../../shared/components/PageTitle";
import GroupCard from "./GroupCard";
import { useGroupList } from "../hooks/useGroupList";

function GroupList() {
    const { groups } = useGroupList();

    return (
        <>
            <PageTitle>Expenses</PageTitle>
            <Card className="my-3">
                <Card.Body className="py-2 d-flex justify-content-between align-items-center">
                    <span>Groups</span>
                    <Link to="create" className="btn btn-primary text-white btn-sm">
                        Create group
                    </Link>
                </Card.Body>
            </Card>
            <Row className="px-2">
                <GroupCard to="personal" icon="bi-lock" name="Personal" />
                {groups.map((group) => (
                    <GroupCard
                        key={group._id}
                        to={group._id}
                        icon={(GROUP_CATEGORIES[group.category] ?? GROUP_CATEGORIES.OTHER).icon}
                        name={group.name}
                        members={group.members}
                        balances={group.balances}
                    />
                ))}
            </Row>
            {groups.length === 0 && (
                <span className="text-muted px-2">You don't belong to any group yet</span>
            )}
        </>
    );
}

export { GroupList };
