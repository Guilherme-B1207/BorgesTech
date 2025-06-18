import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const cartItemsCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky-top">
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="BorgesTech"
              style={{
                height: '40px',
                marginRight: '15px',
                filter: 'brightness(0) invert(1)'
              }}
            /><span
              className="fw-bold"
              style={{
                fontSize: '1.5rem',
                background: 'linear-gradient(90deg, #fff, #aaa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              BorgesTech
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto align-items-lg-center'>
              <div className="me-lg-3 mb-3 mb-lg-0" style={{ width: '300px' }}>
                <SearchBox />
              </div>
              <Nav.Link as={Link}
                to="/cart"
                className="position-relative mx-2 px-3 py-2 rounded-pill"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }}>
                <FaShoppingCart className="me-2" />
                Carrinho
                {cartItemsCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{
                      fontSize: '0.7rem',
                      padding: '5px 8px'
                    }}
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Nav.Link>
              {userInfo ? (
                <NavDropdown
                  title={
                    <div className="d-inline-flex align-items-center">
                      <FiUser className="me-2" />
                      <span>{userInfo.name}</span>
                    </div>
                  }
                  id="username"
                  className="mx-2"
                >
                  <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                    <FiUser className="me-2" /> Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler} className="d-flex align-items-center">
                    <FiLogOut className="me-2" /> Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="mx-2 px-3 py-2 rounded-pill"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  <FaUser className="me-2" />
                  Entrar
                </Nav.Link>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title="Admin"
                  id="adminmenu"
                  className="mx-2"

                >
                  <NavDropdown.Item as={Link} to="/admin/productlist">
                    Gerenciar Produtos
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist">
                    Gerenciar Pedidos
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    Gerenciar Usuários
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
