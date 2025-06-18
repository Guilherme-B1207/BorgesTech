import { Table, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import SearchBox from '../../components/SearchBox';


const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        toast.success('Produto excluído com sucesso');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      await createProduct();
      toast.success('Novo produto criado com sucesso');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <Row className='align-items-center'>
        <Col md={6}>
          <h2 className="mb-0" style={{ fontWeight: '700' }}>
            Gerenciamento de Produtos
          </h2>
        </Col>
        <Col className='text-end'>
          <Button
            variant="primary" className='my-3' onClick={createProductHandler} style={{
              borderRadius: '50px',
              fontWeight: '600'
            }}>
            <FaPlus className="me-2" /> Adicionar produto
          </Button>
        </Col>
      </Row>
      {(loadingCreate || loadingDelete) && <Loader />}

      {error && (
        <Message variant="danger">
          {error?.data?.message || 'Erro ao carregar produtos'}
        </Message>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="text-nowrap">ID</th>
                  <th>NOME</th>
                  <th className="text-nowrap">PREÇO</th>
                  <th>CATEGORIA</th>
                  <th>MARCA</th>
                  <th className="text-center">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td className="text-muted text-truncate" style={{ maxWidth: '150px' }}>
                      {product._id}
                    </td>
                    <td>
                      <Link
                        to={`/product/${product._id}`}
                        className="text-dark fw-semibold"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td >
                      {product.price.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="text-uppercase">
                        {product.category}
                      </Badge>
                    </td>
                    <td>
                      <Badge className="text-uppercase">
                        {product.brand}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button
                        as={Link}
                        to={`/admin/product/${product._id}/edit`}
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        style={{ borderRadius: '50%', width: '34px', height: '34px' }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteHandler(product._id)}
                        style={{ borderRadius: '50%', width: '34px', height: '34px' }}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
      <style>{`
        .table th {
          border-top: none;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          color: #6c757d;
        }
        .table td {
          vertical-align: middle;
          padding: 1rem 0.75rem;
        }
        .table tr:hover {
          background-color: rgba(0,0,0,0.02);
        }
        .badge {
          font-size: 0.75rem;
          padding: 0.35em 0.65em;
        }
      `}</style>
    </div>
  );
};

export default ProductListScreen;
