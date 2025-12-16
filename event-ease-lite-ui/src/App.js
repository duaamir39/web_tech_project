import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Registration from './components/Registration';
import Login from './components/Login';
import EventList from './components/EventList';
import MyBookings from './components/MyBookings';

const isAuthenticated = () => {
    return localStorage.getItem('userToken') !== null;
};

const AppNavbar = () => {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login'; 
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">EventEase Lite</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Events</Nav.Link>
                        {isAuthenticated() && (
                            <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {isAuthenticated() ? (
                            <>
                                <Nav.Link onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};


function App() {
  return (
    <Router>
        <AppNavbar />
        <Container fluid>
            <Routes>
                <Route path="/" element={<EventList />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/my-bookings" element={isAuthenticated() ? <MyBookings /> : <Login />} />
            </Routes>
        </Container>
    </Router>
  );
}

export default App;
