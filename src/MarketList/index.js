import React from "react";
import { Button, Card, ListGroup, ProgressBar } from "react-bootstrap"

function MarketList() {
    const [lists, setLists] = React.useState([]);
    React.useEffect(() => {
        fetch('/market-list')
            .then(response => response.json())
            .then(data => setLists(data));
    }, [])
    return (
        <Card>
            <Card.Header>Recent market list</Card.Header>
            <Card.Body>
                <Card.Title>Special title treatment</Card.Title>
                <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                </Card.Text>
                <ListGroup
                    variant="flush">
                    {
                    lists.map((list, index) => (
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start">
                            {list.date}
                            <ProgressBar className="w-25" now={50} label={"50%"} visuallyHidden/>
                            <Button variant="link" size="sm" href=""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
  <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
</svg></Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
    )
}

export { MarketList }