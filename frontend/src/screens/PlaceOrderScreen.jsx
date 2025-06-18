import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCreditCard, FaBox, FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import Meta from '../components/Meta';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const [createOrder, { isLoading, error }] = useCreateOrderMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!cart.shippingAddress?.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();

            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Erro ao finalizar pedido');
        }
    };

    return (
        <div className="py-4">
            <Meta title="Finalizar Pedido | BorgesTech" />

            <div className="container">
                <CheckoutSteps step1 step2 step3 step4 />

                <h1 className="my-4 text-center" style={{ fontWeight: '700' }}>
                    <FaCheckCircle className="text-success me-2" />
                    Revisar e Finalizar Pedido
                </h1>

                <Row className="g-4">
                    {/* Coluna Esquerda */}
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                        <FaMapMarkerAlt className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="mb-1">Endereço de Entrega</h4>
                                        <p className="mb-0">
                                            {cart.shippingAddress.address}, {cart.shippingAddress.city}<br />
                                            CEP: {cart.shippingAddress.postalCode}<br />
                                            {cart.shippingAddress.country}
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                        <FaCreditCard className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="mb-1">Método de Pagamento</h4>
                                        <p className="mb-0 text-capitalize">
                                            {cart.paymentMethod}
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                        <FaBox className="text-primary" size={24} />
                                    </div>
                                    <h4 className="mb-0">Seus Itens</h4>
                                </div>

                                {cart.cartItems.length === 0 ? (
                                    <div className="text-center py-4">
                                        <FaShoppingBag size={48} className="text-muted mb-3" />
                                        <h5>Seu carrinho está vazio!</h5>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Produto</th>
                                                    <th className="text-end">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.cartItems.map((item) => (
                                                    <tr key={item.product}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '60px',
                                                                        objectFit: 'contain',
                                                                        marginRight: '15px'
                                                                    }}
                                                                />
                                                                <div>
                                                                    <Link
                                                                        to={`/product/${item.product}`}
                                                                        className="text-dark fw-semibold"
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                    <div className="text-muted">
                                                                        {item.qty} × {item.price.toLocaleString('pt-br', {
                                                                            style: 'currency',
                                                                            currency: 'BRL'
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-end fw-bold">
                                                            {(item.qty * item.price).toLocaleString('pt-br', {
                                                                style: 'currency',
                                                                currency: 'BRL'
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Coluna Direita - Resumo */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                            <Card.Body>
                                <h4 className="mb-4">Resumo do Pedido</h4>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Itens ({cart.cartItems.reduce((a, c) => a + c.qty, 0)})</span>
                                        <span>{cart.itemsPrice.toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Frete</span>
                                        <span>{cart.shippingPrice.toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Taxas</span>
                                        <span>{cart.taxPrice.toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</span>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="fw-bold">Total</span>
                                        <span className="text-primary fw-bold" style={{ fontSize: '1.2rem' }}>
                                            {cart.totalPrice.toLocaleString('pt-br', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-100 py-3"
                                    onClick={placeOrderHandler}
                                    disabled={cart.cartItems.length === 0 || isLoading}
                                    style={{ borderRadius: '50px', fontWeight: '600' }}
                                >
                                    {isLoading ? 'Processando...' : 'Confirmar Pedido'}
                                </Button>

                                {error && (
                                    <div className="mt-3 text-danger text-center">
                                        {error?.data?.message || 'Erro ao processar pedido'}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;