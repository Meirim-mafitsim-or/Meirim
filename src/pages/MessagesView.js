import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import { getMessages } from "../common/Database";

export default function MessagesView(){
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        // get messages and sort them by date
        getMessages().then((messages) => {
            messages.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            setMessages(messages);
        }
        );
    }, []);

    return (
        <div style={{
            width: '80%',
            margin: 'auto',
        }}>
            <h1>Messages</h1>
            {messages.map((message) => (
                <Card key={message.id} className="m-2">
                    <Card.Body>
                        <Card.Title>{message.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{message.email}</Card.Subtitle>
                        <Card.Text>{message.message}</Card.Text>
                        <Card.Text>{message.phone_number}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
        
}