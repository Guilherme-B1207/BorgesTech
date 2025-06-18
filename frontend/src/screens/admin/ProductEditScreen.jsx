import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
    description: ''
  });

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price !== undefined ? String(product.price) : '',
        image: product.image || '',
        brand: product.brand || '',
        category: product.category || '',
        countInStock: product.countInStock !== undefined ? String(product.countInStock) : '',
        description: product.description || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock)
      }).unwrap();
      toast.success('Produto atualizado com sucesso');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      setFormData({ ...formData, image: res.image });
      toast.success('Imagem carregada com sucesso');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/admin/productlist" className="btn btn-light">
          <FaArrowLeft className="me-1" /> Voltar
        </Link>
        <h4 className="mb-0 text-center flex-grow-1">Editar Produto</h4>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <Row>
          <Col md={6} className="mx-auto">
            <div className="border p-4 rounded">
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preço (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imagem</Form.Label>
                  {formData.image && (
                    <Image src={formData.image} fluid className="mb-2 rounded" style={{ maxHeight: '150px' }} />
                  )}
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="URL da imagem"
                      className="me-2"
                    />
                    <Form.Control
                      type="file"
                      onChange={uploadFileHandler}
                      accept="image/*"
                      style={{ width: 'auto' }}
                    />
                  </div>
                  {loadingUpload && <Loader small />}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Estoque</Form.Label>
                  <Form.Control
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loadingUpdate}>
                    <FaSave className="me-1" />
                    {loadingUpdate ? 'Salvando...' : 'Atualizar'}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      )}

      <footer className="mt-4 text-center text-muted small">
        BorgesTech © {new Date().getFullYear()}
      </footer>
    </Container>
  );
};

export default ProductEditScreen;