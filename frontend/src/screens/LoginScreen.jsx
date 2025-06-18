import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card className="shadow-lg p-4" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h1 className="text-primary">BorgesTech</h1>
          <h3 className="text-muted">Entrar</h3>
        </div>

        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Insira o Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2"
              style={{ borderRadius: '10px' }}
            />
          </Form.Group>

          <Form.Group className='mb-4' controlId='password'>
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type='password'
              placeholder='Insira a senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2"
              style={{ borderRadius: '10px' }}
            />
          </Form.Group>

          <Button
            disabled={isLoading}
            type='submit'
            variant='primary'
            className="w-100 py-2 mb-3"
            style={{ borderRadius: '10px', fontWeight: '600' }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className='text-center mt-3'>
          <Col>
            <p className="text-muted">
              Novo Cliente?{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                className="text-primary text-decoration-none"
                style={{ fontWeight: '600' }}
              >
                Registrar
              </Link>
            </p>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default LoginScreen;