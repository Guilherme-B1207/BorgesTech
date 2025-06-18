import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaTruck, FaCreditCard, FaUser } from 'react-icons/fa';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  // Load PayPal script
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'BRL',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  // PayPal handlers
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Pagamento realizado com sucesso');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  };

  const onError = (err) => {
    toast.error(err.message);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: order.totalPrice,
          currency_code: 'BRL'
        },
      }],
    });
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Pedido marcado como entregue');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error.data.message}</Message>;

  return (
    <div className="py-4">
      <Meta title={`Pedido #${order._id} | BorgesTech`} />

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0" style={{ fontWeight: '700' }}>
            Pedido #{order._id}
          </h1>
          <Badge bg={order.isPaid ? 'success' : 'warning'} className="text-uppercase">
            {order.isPaid ? 'Pago' : 'Pagamento Pendente'}
          </Badge>
        </div>

        <Row className="g-4">
          {/* Coluna Esquerda */}
          <Col lg={8}>
            {/* Seção de Envio */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <FaTruck className="text-primary" size={24} />
                  </div>
                  <h4 className="mb-0">Informações de Envio</h4>
                </div>

                <div className="ps-5">
                  <div className="mb-3">
                    <h6 className="fw-semibold mb-1">Cliente</h6>
                    <div className="d-flex align-items-center">
                      <FaUser className="text-muted me-2" />
                      <span>{order.user.name}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <a href={`mailto:${order.user.email}`} className="text-primary">
                        {order.user.email}
                      </a>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="fw-semibold mb-1">Endereço de Entrega</h6>
                    <p className="mb-0">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>

                  <div className="d-flex align-items-center">
                    {order.isDelivered ? (
                      <Badge bg="success" className="d-flex align-items-center">
                        <FaCheckCircle className="me-2" />
                        Entregue em {new Date(order.deliveredAt).toLocaleDateString('pt-BR')}
                      </Badge>
                    ) : (
                      <Badge bg="secondary" className="d-flex align-items-center">
                        <FaTimesCircle className="me-2" />
                        Aguardando entrega
                      </Badge>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Seção de Pagamento */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <FaCreditCard className="text-primary" size={24} />
                  </div>
                  <h4 className="mb-0">Método de Pagamento</h4>
                </div>

                <div className="ps-5">
                  <div className="mb-3">
                    <h6 className="fw-semibold mb-1">Forma de Pagamento</h6>
                    <p className="text-capitalize">{order.paymentMethod}</p>
                  </div>

                  <div>
                    {order.isPaid ? (
                      <Badge bg="success" className="d-flex align-items-center">
                        <FaCheckCircle className="me-2" />
                        Pago em {new Date(order.paidAt).toLocaleDateString('pt-BR')}
                      </Badge>
                    ) : (
                      <Badge bg="danger" className="d-flex align-items-center">
                        <FaTimesCircle className="me-2" />
                        Aguardando pagamento
                      </Badge>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Seção de Itens */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <FaBoxOpen className="text-primary" size={24} />
                  </div>
                  <h4 className="mb-0">Itens do Pedido</h4>
                </div>

                {order.orderItems.length === 0 ? (
                  <div className="text-center py-4">
                    <Message>Nenhum item encontrado neste pedido</Message>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th className="text-end">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map((item) => (
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
                    </Table>
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
                    <span className="text-muted">Itens ({order.orderItems.reduce((a, c) => a + c.qty, 0)})</span>
                    <span>{order.itemsPrice.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Frete</span>
                    <span>{order.shippingPrice.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Taxas</span>
                    <span>{order.taxPrice.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold">Total</span>
                    <span className="text-primary fw-bold" style={{ fontSize: '1.2rem' }}>
                      {order.totalPrice.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>

                {/* PayPal Button */}
                {!order.isPaid && (
                  <div className="mb-4">
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        style={{ layout: 'vertical' }}
                      />
                    )}
                  </div>
                )}

                {/* Admin Deliver Button */}
                {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                  <Button
                    variant="primary"
                    className="w-100 py-3"
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                    style={{ borderRadius: '50px', fontWeight: '600' }}
                  >
                    {loadingDeliver ? 'Processando...' : 'Marcar como Entregue'}
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderScreen;