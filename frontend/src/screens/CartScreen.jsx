import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Form, Button, Card, Badge } from 'react-bootstrap';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaLock } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Meta from '../components/Meta';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="py-4">
      <Meta title="Carrinho de Compras | BorgesTech" />

      <div className="mb-4">
        <Button
          as={Link}
          to="/"
          variant="outline-secondary"
          className="d-inline-flex align-items-center"
          style={{ borderRadius: '50px', padding: '8px 16px' }}
        >
          <FaArrowLeft className="me-2" />
          Continuar Comprando
        </Button>
      </div>

      <h1 className="mb-4" style={{ fontWeight: '700' }}>Seu Carrinho</h1>

      {cartItems.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <FaShoppingBag className="text-muted mb-3" size={48} />
            <h4 className="mb-3">Seu carrinho está vazio</h4>
            <p className="text-muted mb-4">Parece que você ainda não adicionou nenhum item</p>
            <Button
              as={Link}
              to="/"
              variant="primary"
              style={{ borderRadius: '50px', padding: '10px 24px' }}
            >
              Ver Produtos
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                {cartItems.map((item) => (
                  <div key={item._id} className="d-flex py-3 border-bottom">
                    <div className="flex-shrink-0 me-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-dark fw-bold mb-1"
                          style={{ textDecoration: 'none' }}
                        >
                          {item.name}
                        </Link>
                        <Button
                          variant="link"
                          onClick={() => removeFromCartHandler(item._id)}
                          className="text-danger p-0"
                        >
                          <FaTrash />
                        </Button>
                      </div>

                      <div className="d-flex align-items-center mt-2 mb-3">
                        <span className="text-muted me-3">Quantidade:</span>
                        <Form.Select
                          value={item.qty}
                          onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                          style={{
                            width: '80px',
                            borderRadius: '8px'
                          }}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </div>

                      <div className="fw-bold">
                        {item.price.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-3 fw-bold">Resumo do Pedido</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal ({itemsCount} itens):</span>
                  <span className="fw-bold">
                    {totalPrice.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold">Total:</span>
                  <span className="text-primary fw-bold" style={{ fontSize: '1.2rem' }}>
                    {totalPrice.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>

                <Button
                  variant="primary"
                  className="w-100 py-3 d-flex align-items-center justify-content-center"
                  onClick={checkoutHandler}
                  style={{
                    borderRadius: '50px',
                    fontWeight: '600'
                  }}
                >
                  <FaLock className="me-2" />
                  Finalizar Compra
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartScreen;