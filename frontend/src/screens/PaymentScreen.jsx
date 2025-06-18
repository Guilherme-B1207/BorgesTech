import { useState, useEffect } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FaArrowRight, FaCreditCard, FaPaypal } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import Meta from '../components/Meta';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, shippingAddress]);

    const [paymentMethod, setPaymentMethod] = useState('Pix');
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    const paymentOptions = [
        {
            id: 'Pix',
            label: 'Pix',
            description: 'Pagamento instantâneo com até 10% de desconto'
        },
        {
            id: 'Cartão de Crédito',
            label: 'Cartão de Crédito',
            icon: <FaCreditCard size={24} className="text-info" />,
            description: 'Parcelamento em até 12x sem juros'
        },
        {
            id: 'PayPal',
            label: 'PayPal',
            icon: <FaPaypal size={24} className="text-primary" />,
            description: 'Pagamento seguro com proteção ao comprador'
        }
    ];

    return (
        <div className="py-4">
            <Meta title="Método de Pagamento | BorgesTech" />

            <div className="container" style={{ maxWidth: '800px' }}>
                <CheckoutSteps step1 step2 step3 />

                <Card className="border-0 shadow-sm mt-3">
                    <Card.Body className="p-4">
                        <h2 className="text-center mb-4" style={{ fontWeight: '700' }}>
                            Método de Pagamento
                        </h2>

                        <form onSubmit={submitHandler}>
                            <div className="mb-4">
                                <h5 className="mb-3 fw-semibold">Selecione seu método de pagamento:</h5>

                                <div className="d-grid gap-3">
                                    {paymentOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            className={`payment-option p-3 rounded-3 ${paymentMethod === option.id ? 'border-primary border-2' : 'border'}`}
                                            onClick={() => setPaymentMethod(option.id)}
                                            style={{
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className="me-3">
                                                    {option.icon}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="fw-bold">{option.label}</span>
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value={option.id}
                                                            checked={paymentMethod === option.id}
                                                            onChange={() => { }}
                                                            className="form-check-input"
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                    </div>
                                                    <small className="text-muted">{option.description}</small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

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
                                    Continuar para Revisão
                                    <FaArrowRight className="ms-2" />
                                </Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </div>

            <style jsx>{`
                .payment-option:hover {
                    background-color: #f8f9fa;
                    border-color: #0d6efd !important;
                }
                .payment-option {
                    background-color: ${paymentMethod === 'Pix' ? 'rgba(13, 110, 253, 0.05)' :
                    paymentMethod === 'Cartão de Crédito' ? 'rgba(23, 162, 184, 0.05)' :
                        'rgba(13, 110, 253, 0.05)'};
                }
            `}</style>
        </div>
    );
};

export default PaymentScreen;