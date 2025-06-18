import { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCity, FaEnvelope, FaFlag, FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import Meta from '../components/Meta';

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className="py-4">
            <Meta title="Endereço de Envio | BorgesTech" />

            <div className="container" style={{ maxWidth: '800px' }}>
                <CheckoutSteps step1 step2 />

                <Card className="border-0 shadow-sm mt-3">
                    <Card.Body className="p-4">
                        <h2 className="text-center mb-4" style={{ fontWeight: '700' }}>
                            <FaMapMarkerAlt className="text-primary me-2" />
                            Endereço de Entrega
                        </h2>

                        <Form onSubmit={submitHandler}>
                            <Row className="mb-3">
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="address">
                                        <Form.Label className="fw-semibold">
                                            <FaMapMarkerAlt className="me-2 text-muted" />
                                            Endereço Completo
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex: Rua Borges Tech, 123 - Apt 101"
                                            value={address}
                                            required
                                            onChange={(e) => setAddress(e.target.value)}
                                            style={{
                                                borderRadius: '8px',
                                                padding: '12px 15px',
                                                borderLeft: '3px solid #3C4C5D'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="city">
                                        <Form.Label className="fw-semibold">
                                            <FaCity className="me-2 text-muted" />
                                            Cidade
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex: São Paulo"
                                            value={city}
                                            required
                                            onChange={(e) => setCity(e.target.value)}
                                            style={{
                                                borderRadius: '8px',
                                                padding: '12px 15px',
                                                borderLeft: '3px solid #3C4C5D'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="postalCode">
                                        <Form.Label className="fw-semibold">
                                            <FaEnvelope className="me-2 text-muted" />
                                            CEP
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex: 00000-000"
                                            value={postalCode}
                                            required
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            style={{
                                                borderRadius: '8px',
                                                padding: '12px 15px',
                                                borderLeft: '3px solid #3C4C5D'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group controlId="country">
                                        <Form.Label className="fw-semibold">
                                            <FaFlag className="me-2 text-muted" />
                                            País
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex: Brasil"
                                            value={country}
                                            required
                                            onChange={(e) => setCountry(e.target.value)}
                                            style={{
                                                borderRadius: '8px',
                                                padding: '12px 15px',
                                                borderLeft: '3px solid #3C4C5D'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="text-center mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="px-5 py-3"
                                    style={{
                                        borderRadius: '50px',
                                        fontWeight: '600',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Continuar para Pagamento
                                    <FaArrowRight className="ms-2" />
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default ShippingScreen;