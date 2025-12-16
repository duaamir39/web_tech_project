import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { API_ENDPOINTS } from '../config/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('Login attempt:', { email: formData.email });

        try {
            const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, formData);
            
            const { token, name, userId } = response.data;
            localStorage.setItem('userToken', token);
            localStorage.setItem('userName', name);
            localStorage.setItem('userId', userId);
            alert(`Welcome back, ${name}!`);
            window.location.href = '/';
            
        } catch (err) {
            console.error("Login Error:", err.response || err);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="p-4 shadow">
                        <h2 className="text-center mb-4">EventEase Lite Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="loginFormEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="loginFormPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>

                            <Button 
                                variant="success" 
                                type="submit" 
                                disabled={loading}
                                className="w-100"
                            >
                                {loading ? 'Logging In...' : 'Login'}
                            </Button>
                        </Form>
                        
                        <div className="text-center mt-3">
                            <p>Don't have an account? <a href="/register">Register here</a></p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;