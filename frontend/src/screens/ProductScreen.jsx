import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Card, Button, Form, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success('Avaliação enviada com sucesso!');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success(`${product.name} foi adicionado ao carrinho!`);

  };

  return (
    <div className="product-screen" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4">
        <Link
          className="btn btn-light mb-4 d-inline-flex align-items-center"
          to="/"
          style={{ borderRadius: '8px' }}
        >
          <FaArrowLeft className="me-2" /> Voltar
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <Meta title={product.name} description={product.description} />
            <Row className="g-4">
              <Col md={6}>
                <div className="bg-white p-4 rounded-3 shadow-sm text-center" style={{ height: '100%' }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fluid
                    style={{
                      maxHeight: '350px',
                      width: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                  <h1 className="mb-3" style={{ fontSize: '1.8rem', fontWeight: '600' }}>
                    {product.name}
                  </h1>

                  <div className="d-flex align-items-center mb-3">
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} Avaliações`}
                      color="#ffc107"
                    />
                  </div>

                  <div className="price-section mb-4">
                    <h2 className="text-dark" style={{ fontWeight: '700', fontSize: '1.8rem' }}>
                      {product?.price?.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </h2>
                  </div>

                  <div className="description mb-4">
                    <p className="text-muted" style={{ lineHeight: '1.6' }}>{product.description}</p>
                  </div>

                  <Card className="mb-4 border-0 shadow-sm">
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between py-3">
                        <span className="text-muted">Preço:</span>
                        <span className="fw-bold">
                          {product?.price?.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between py-3">
                        <span className="text-muted">Status:</span>
                        <span className={product.countInStock > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                          {product.countInStock > 0 ? 'Em estoque' : 'Esgotado'}
                        </span>
                      </ListGroup.Item>
                      {product.countInStock > 0 && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                          <span className="text-muted">Quantidade:</span>
                          <Form.Select
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            style={{
                              width: '80px',
                              borderRadius: '6px'
                            }}
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Select>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card>

                  <Button
                    className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
                    variant="primary"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                    style={{
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <FaShoppingCart className="me-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={12}>
                <div className="bg-white p-4 rounded-3 shadow-sm">
                  <h3 className="mb-4" style={{ fontSize: '1.4rem', fontWeight: '600' }}>Avaliações</h3>

                  {product.reviews.length === 0 ? (
                    <Message>Sem Reviews</Message>
                  ) : (
                    <div className="reviews-list">
                      {product.reviews.map((review) => (
                        <div key={review._id} className="mb-4 pb-4 border-bottom">
                          <div className="d-flex justify-content-between mb-2">
                            <strong>{review.name}</strong>
                            <small className="text-muted">
                              {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                            </small>
                          </div>
                          <Rating value={review.rating} color="#ffc107" />
                          <p className="mt-2 mb-0">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-5">
                    <h4 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                      Escreva uma avaliação do cliente
                    </h4>

                    {loadingProductReview && <Loader />}

                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3">
                          <Form.Label>Avaliação</Form.Label>
                          <Form.Control
                            as="select"
                            required
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            style={{ borderRadius: '6px' }}
                          >
                            <option value="">Selecione...</option>
                            <option value="1">1 - Muito ruim</option>
                            <option value="2">2 - Ruim</option>
                            <option value="3">3 - Bom</option>
                            <option value="4">4 - Muito bom</option>
                            <option value="5">5 - Excelente</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Comentário</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ borderRadius: '6px' }}
                          />
                        </Form.Group>

                        <Button
                          type="submit"
                          variant="primary"
                          style={{ borderRadius: '6px' }}
                        >
                          Enviar
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        Por favor <Link to="/login">Entre</Link> para fazer uma avaliação
                      </Message>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductScreen;