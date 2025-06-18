import { Table, Button, Card, Badge } from 'react-bootstrap';
import { FaTimes, FaCheck, FaSearch, FaFileAlt } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import SearchBox from '../../components/SearchBox';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="py-4">
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-0" style={{ fontWeight: '700' }}>
                Gerenciamento de Pedidos
              </h2>
              <small className="text-muted">
                {orders?.length} pedidos encontrados
              </small>
            </div>
          </div>
          {error && (
            <Message variant="danger">
              {error?.data?.message || 'Erro ao carregar pedidos'}
            </Message>
          )}
          {isLoading ? (
            <Loader />
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="text-nowrap">ID</th>
                    <th>CLIENTE</th>
                    <th className="text-nowrap">DATA</th>
                    <th className="text-nowrap">VALOR</th>
                    <th className="text-center">PAGO</th>
                    <th className="text-center">ENTREGUE</th>
                    <th className="text-center">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="text-muted text-truncate" style={{ maxWidth: '150px' }}>
                        {order._id}
                      </td>
                      <td>
                        {order.user && order.user.name}
                        <br />
                        <small className="text-muted">{order.user && order.user.email}</small>
                      </td>
                      <td className="text-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="fw-bold">
                        {order.totalPrice.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </td>
                      <td className="text-center">
                        {order.isPaid ? (
                          <Badge bg="success" pill>
                            <FaCheck className="me-1" />
                            {new Date(order.paidAt).toLocaleDateString('pt-BR')}
                          </Badge>
                        ) : (
                          <Badge bg="danger" pill>
                            <FaTimes />
                          </Badge>
                        )}
                      </td>
                      <td className="text-center">
                        {order.isDelivered ? (
                          <Badge bg="success" pill>
                            <FaCheck className="me-1" />
                            {new Date(order.deliveredAt).toLocaleDateString('pt-BR')}
                          </Badge>
                        ) : (
                          <Badge bg="danger" pill>
                            <FaTimes />
                          </Badge>
                        )}
                      </td>
                      <td className="text-center">
                        <Button
                          as={Link}
                          to={`/order/${order._id}`}
                          variant="outline-primary"
                          size="sm"
                          className="px-3"
                          style={{ borderRadius: '50px' }}
                        >
                          <FaFileAlt className="me-1" />
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
          padding: 0.5em 0.75em;
        }
      `}</style>
    </div>
  );
};

export default OrderListScreen;