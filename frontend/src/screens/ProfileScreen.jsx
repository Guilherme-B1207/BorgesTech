import React, { useEffect, useState } from 'react';
import { Card, Container, Form, Button, Row, Col, Table, Badge } from 'react-bootstrap';
import { FaTimes, FaCheck, FaSearch, FaUserEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
    } else {
      try {
        const res = await updateProfile({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Perfil atualizado com sucesso');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filteredOrders = orders?.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.totalPrice.toString().includes(searchTerm)
  );

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-primary">
            <FaUserEdit className="me-2" />
            BorgesTech
          </h1>
        </Col>
      </Row>

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary rounded-circle p-3 me-3">
                  <FaUserEdit size={24} color="white" />
                </div>
                <div>
                  <h3 className="mb-0">Perfil de usuário</h3>
                  <p className="text-muted mb-0">Gerencie suas informações</p>
                </div>
              </div>

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="py-2"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nova Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Confirme a Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="py-2"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2 gradient-btn"
                  style={{
                    borderRadius: '10px',
                    fontWeight: '600',
                    border: 'none',
                    background: 'linear-gradient(135deg,rgb(49, 51, 53),rgb(119, 125, 128))'
                  }}
                  disabled={loadingUpdateProfile}
                >
                  {loadingUpdateProfile ? 'Atualizando...' : 'Atualizar Perfil'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="mb-0">Meus Pedidos</h3>
                  <p className="text-muted mb-0">Histórico de compras</p>
                </div>

              </div>

              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">
                  {error?.data?.message || error.error}
                </Message>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>DATA</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                        <th>AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders?.map((order) => (
                        <tr key={order._id}>
                          <td className="text-truncate" style={{ maxWidth: '150px' }}>
                            {order._id}
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Badge bg="light" text="dark" className="fs-6">
                              R$ {order.totalPrice.toFixed(2)}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="d-flex align-items-center">
                                {order.isPaid ? (
                                  <FaCheck className="text-success me-1" />
                                ) : (
                                  <FaTimes className="text-danger me-1" />
                                )}
                                PAGO
                              </span>
                              <span className="d-flex align-items-center">
                                {order.isDelivered ? (
                                  <FaCheck className="text-success me-1" />
                                ) : (
                                  <FaTimes className="text-danger me-1" />
                                )}
                                ENTREGUE
                              </span>
                            </div>
                          </td>
                          <td>
                            <Button
                              as={Link}
                              to={`/order/${order._id}`}
                              size="sm"
                              variant="outline-primary"
                              className="px-3"
                            >
                              Detalhes
                            </Button>
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
      </Row>
    </Container>
  );
};

export default ProfileScreen;