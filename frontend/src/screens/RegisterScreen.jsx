import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Card className="shadow-lg p-4" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px', border: 'none' }}>
        <div className="text-center mb-4">
          <h1 className="text-primary">BorgesTech</h1>
          <h3 className="text-muted">Criar Conta</h3>
          <p className="text-muted">Preencha os campos para se registrar</p>
        </div>

        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label className="fw-semibold">Nome Completo</Form.Label>
            <Form.Control
              type='text'
              placeholder='Digite seu nome completo'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-2"
              style={{ borderRadius: '10px' }}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='email'>
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Digite seu email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2"
              style={{ borderRadius: '10px' }}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='password'>
            <Form.Label className="fw-semibold">Senha</Form.Label>
            <Form.Control
              type='password'
              placeholder='Crie uma senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2"
              style={{ borderRadius: '10px' }}
              required
            />
          </Form.Group>

          <Form.Group className='mb-4' controlId='confirmPassword'>
            <Form.Label className="fw-semibold">Confirme a Senha</Form.Label>
            <Form.Control
              type='password'
              placeholder='Repita a senha'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="py-2"
              style={{ borderRadius: '10px' }}
              required
            />
          </Form.Group>

          <Button
            disabled={isLoading}
            type='submit'
            variant='primary'
            className="w-100 py-2 mb-3 gradient-btn"
            style={{
              borderRadius: '10px',
              fontWeight: '600',
              border: 'none',
              background: 'linear-gradient(135deg,rgb(49, 51, 53),rgb(119, 125, 128))'
            }}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className='text-center mt-3'>
          <Col>
            <p className="text-muted">
              Já tem uma conta?{' '}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : '/login'}
                className="text-primary text-decoration-none fw-semibold"
              >
                Entrar
              </Link>
            </p>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default RegisterScreen;