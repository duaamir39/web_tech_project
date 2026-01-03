import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        setUserName(storedName);
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        setLoading(true);
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            setError("Please log in to view your bookings.");
            setLoading(false);
            return;
        }

        console.log('Fetching bookings from:', API_ENDPOINTS.BOOKING.MY_BOOKINGS);

        try {
            const response = await axios.get(API_ENDPOINTS.BOOKING.MY_BOOKINGS, {
                headers: getAuthHeaders()
            });
            
            console.log('Bookings fetched successfully:', response.data.length);
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch bookings:", err.response || err);
            setError('Failed to load bookings. Are you still logged in?');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status" />
                <p>Loading your bookings...</p>
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
            <h1 className="mb-4">Welcome, {userName || 'User'}!</h1>
            <h2 className="mb-4">My Booked Tickets</h2>
            
            {bookings.length === 0 ? (
                <Alert variant="info">
                    You currently have no booked tickets. Browse our <a href="/">events</a>!
                </Alert>
            ) : (
                <ListGroup>
                    {bookings.map((booking, index) => (
                        <ListGroup.Item key={booking.id} className="shadow-sm mb-3">
                            <Row>
                                <Col md={8}>
                                    <strong>Event ID:</strong> {booking.eventId}<br/>
                                    <strong>Booking ID:</strong> {booking.id}
                                </Col>
                                <Col md={4} className="text-end text-muted">
                                    Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                                </Col>
                            </Row>
    
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default MyBookings;
