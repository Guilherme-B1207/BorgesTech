import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaUser, FaUserCog, FaSave } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success('Usuário atualizado com sucesso!');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <div className="py-4">
      <Button
        as={Link}
        to='/admin/userlist'
        variant="outline-secondary"
        className="mb-4 d-inline-flex align-items-center"
        style={{ borderRadius: '50px', padding: '8px 16px' }}
      >
        <FaArrowLeft className="me-2" />
        Voltar
      </Button>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: isAdmin ? '#3C4C5D' : '#20c997',
              color: 'white',
              fontSize: '2rem'
            }}>
              {isAdmin ? <FaUserCog /> : <FaUser />}
            </div>
            <h2 className="mb-0" style={{ fontWeight: '700' }}>
              Editar Usuário
            </h2>
            <small className="text-muted">
              ID: {userId.substring(0, 8)}...
            </small>
          </div>

          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Row className="mb-3">
                <Col md={6} className="mb-3 mb-md-0">
                  <Form.Group controlId="name">
                    <Form.Label className="fw-semibold">Nome</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ borderRadius: '8px', padding: '12px 15px' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Digite o email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ borderRadius: '8px', padding: '12px 15px' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="isadmin" className="mb-4">
                <Form.Check
                  type="switch"
                  id="admin-switch"
                  label={
                    <span className="fw-semibold">
                      {isAdmin ? 'Administrador' : 'Usuário Comum'}
                    </span>
                  }
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="d-flex align-items-center"
                  style={{ gap: '10px' }}
                />
              </Form.Group>

              <div className="text-center">
                <Button
                  type="submit"
                  variant="primary"
                  className="px-5 py-2"
                  style={{
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}
                  disabled={loadingUpdate}
                >
                  <FaSave className="me-2" />
                  {loadingUpdate ? 'Salvando...' : 'Atualizar Usuário'}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserEditScreen;