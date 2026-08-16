import React from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../../../components/Avatar";
import { formatMoney } from "../../../../utils/formatting";
import "./index.scss";

const MAX_VISIBLE_MEMBERS = 4;

function BalanceLine({ currency, amount }) {
    if (amount === 0) {
        return (
            <div className="mb-1">
                <span className="text-muted small">Settled{currency ? ` (${currency})` : ""}</span>
            </div>
        );
    }
    const isPositive = amount > 0;
    return (
        <div className="mb-1">
            <span className="text-muted small d-block">{isPositive ? "They owe you" : "You owe"}</span>
            <strong className={isPositive ? "text-success" : "text-danger"}>
                {formatMoney(Math.abs(amount))}
            </strong>
            {currency && <span className="text-muted small"> {currency}</span>}
        </div>
    );
}

function MemberAvatars({ members }) {
    const visible = members.slice(0, MAX_VISIBLE_MEMBERS);
    const overflow = members.length - visible.length;
    return (
        <div className="avatar-stack d-flex align-items-center mt-2">
            {visible.map((member, index) => (
                <Avatar
                    key={member.uid ?? index}
                    user={member}
                    size={22}
                    className="border border-grey"
                />
            ))}
            {overflow > 0 && <span className="text-muted small ms-2">+{overflow}</span>}
        </div>
    );
}

function GroupCard({ to, icon, name, members, balances }) {
    return (
        <Col xs={6} sm={4} md={3} className="mb-3">
            <Link to={to} className="text-decoration-none d-block h-100">
                <Card className="group-card shadow-sm mb-3 h-100">
                    <i className={`bi ${icon} text-primary group-card-icon`}></i>
                    <Card.Body className="position-relative pb-0">
                        <h3 className="fs-5 mb-0">{name}</h3>
                        {balances &&
                            (balances.length > 0 ? (
                                balances.map((balance) => <BalanceLine key={balance.currency} {...balance} />)
                            ) : (
                                <BalanceLine amount={0} />
                            ))}
                        {members && <MemberAvatars members={members} />}
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    );
}

export default GroupCard;
