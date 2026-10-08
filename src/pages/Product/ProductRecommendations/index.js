import React from "react";
import { Badge, Card, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../app/providers/app";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

function ProductRecommendations() {
    const { api } = React.useContext(AppContext);
    const { request } = useApiRequest(api);
    const [recommendations, setRecommendations] = React.useState([]);

    React.useEffect(() => {
        request((client) => client.get(`/products/recommendations`))
            .then((response) => {
                setRecommendations(response.data);
            })
            .catch(() => {});
    }, []);

    if (recommendations.length === 0) {
        return <></>;
    }
    return (
        <Card>
            <Card.Title className="p-2 text-secondary">
                <i className="bi bi-stars"></i> Recommendations
            </Card.Title>
            <Card.Body className="d-flex flex-row flex-wrap">
                {recommendations.map((recommended, index) => (
                    <InputGroup key={index} className="mb-3 me-3 w-auto">
                        <InputGroup.Text className="position-relative">
                            {recommended.product_name}
                            <Badge
                                className="position-absolute top-0 start-0 translate-middle z-3"
                                bg="secondary"
                            >
                                {recommended.count}
                            </Badge>
                        </InputGroup.Text>
                        <Link className="btn btn-outline-primary">
                            <i className="bi bi-check-lg"></i>
                        </Link>
                        <Link className="btn btn-outline-primary">
                            <i className="bi bi-x-lg"></i>
                        </Link>
                    </InputGroup>
                ))}
            </Card.Body>
        </Card>
    );
}

export { ProductRecommendations };
