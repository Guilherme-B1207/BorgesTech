import React from 'react';
import { Table, Button, Card, Badge, Row, Col } from 'react-bootstrap';
import { FaTrash, FaEdit, FaUserCog, FaUser, FaSearch } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import SearchBox from '../../components/SearchBox';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteUser(id);
        toast.success('Usuário excluído com sucesso');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="py-4">
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <h2 className="mb-0" style={{ fontWeight: '700' }}>
                Gerenciamento de Usuários
              </h2>
              <small className="text-muted">
                {users?.length} usuários cadastrados
              </small>
            </Col>
          </Row>
          {(isLoading || loadingDelete) && <Loader />}
          {error && (
            <Message variant="danger">
              {error?.data?.message || 'Erro ao carregar usuários'}
            </Message>
          )}
          {!isLoading && !error && (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th>NOME</th>
                    <th>EMAIL</th>
                    <th className="text-center">TIPO</th>
                    <th className="text-center">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: user.isAdmin ? '#3C4C5D' : '#20c997',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}>
                            {user.isAdmin ? <FaUserCog /> : <FaUser />}
                          </div>
                          <div>
                            <div className="fw-semibold">{user.name}</div>
                            <small className="text-muted">ID: {user._id.substring(0, 8)}...</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a href={`mailto:${user.email}`} className="text-primary">
                          {user.email}
                        </a>
                      </td>
                      <td className="text-center">
                        <Badge bg={user.isAdmin ? "secondary" : "success"} className="text-uppercase">
                          {user.isAdmin ? 'Administrador' : 'Usuário'}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button
                          as={Link}
                          to={`/admin/user/${user._id}/edit`}
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          style={{ borderRadius: '50%', width: '34px', height: '34px' }}
                        >
                          <FaEdit />
                        </Button>
                        {!user.isAdmin && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteHandler(user._id)}
                            style={{ borderRadius: '50%', width: '34px', height: '34px' }}
                          >
                            <FaTrash />
                          </Button>
                        )}
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
          padding: 1rem;
        }
        .table tr:hover {
          background-color: rgba(0,0,0,0.02);
        }
        .badge {
          font-size: 0.75rem;
          padding: 0.5em 0.75em;
        }
        .badge-purple {
          background-color: #6f42c1;
        }
      `}</style>
    </div>
  );
};

export default UserListScreen;