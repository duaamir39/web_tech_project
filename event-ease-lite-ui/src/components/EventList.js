import React, { useState, useEffect, useMemo } from 'react'; 
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form } from 'react-bootstrap'; 
import EventModel from '../models/EventModel';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        console.log('Fetching events from:', API_ENDPOINTS.EVENT);
        
        try {
            const response = await axios.get(API_ENDPOINTS.EVENT); 
            
            console.log('Events fetched successfully:', response.data.length);
            
            const eventData = response.data.map(e => 
                new EventModel(
                    e.id, 
                    e.title, 
                    e.description, 
                    e.location, 
                    e.date, 
                    e.ticketPrice, 
                    e.availableSeats
                )
            );
            setEvents(eventData);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch events:", err.response || err);
            setError('Failed to load events. Please check the backend API connection.');
            setLoading(false);
        }
    };
    
    const filteredEvents = useMemo(() => {
        if (!searchTerm) {
            return events;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();

        return events.filter(event => 
            event.title.toLowerCase().includes(lowerCaseSearch) ||
            event.description.toLowerCase().includes(lowerCaseSearch) ||
            event.location.toLowerCase().includes(lowerCaseSearch)
        );
    }, [events, searchTerm]);
    
    const handleBookTicket = async (eventId, eventTitle) => {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            alert("You must be logged in to book tickets.");
            return;
        }

        if (!window.confirm(`Are you sure you want to book a ticket for "${eventTitle}"?`)) {
            return;
        }
        
        console.log('Booking ticket for event:', eventId);
        
        setLoading(true);

        try {
            await axios.post(
                API_ENDPOINTS.BOOKING.CREATE, 
                { eventId: eventId },
                {
                    headers: getAuthHeaders()
                }
            );

            console.log('Booking successful for:', eventTitle);
            alert(`Success! Ticket booked for: ${eventTitle}.`);
            await fetchEvents();

        } catch (err) {
            console.error("Booking Error:", err.response || err);
            const errorMessage = err.response?.data?.message || 'Booking failed. Server error or sold out.';
            setError(errorMessage);
            alert(`Booking Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status" />
                <p>Loading events...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }
    
    return (
        <Container className="my-5">
            <h1 className="text-center mb-5">Upcoming Events</h1>
            
            <Row className="mb-4 justify-content-center">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search events by title, description, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>
            {filteredEvents.length === 0 && !loading && (
                <Alert variant="info" className="mt-4">
                    {searchTerm ? `No events found matching "${searchTerm}".` : 'No upcoming events available at the moment.'}
                </Alert>
            )}

            <Row xs={1} md={2} lg={3} className="g-4">
                {filteredEvents.map(event => ( 
                    <Col key={event.id}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title className="text-primary">{event.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {event.date} at {event.location}
                                </Card.Subtitle>
                                <Card.Text>{event.description}</Card.Text>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="mb-0">
                                        <strong>Price:</strong> Rs.{event.ticketPrice.toFixed(2)}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Seats:</strong> {event.availableSeats}
                                    </p>
                                </div>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <Button 
                                    variant="success" 
                                    onClick={() => handleBookTicket(event.id, event.title)}
                                    disabled={event.availableSeats <= 0}
                                >
                                    {event.availableSeats > 0 ? 'Book Ticket' : 'Sold Out'}
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default EventList;
