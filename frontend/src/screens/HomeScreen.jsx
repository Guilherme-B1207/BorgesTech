import { Row, Col, Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { FaArrowLeft } from 'react-icons/fa';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className="home-screen">

      <Meta />

      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Voltar
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>

          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="fw-bold mb-0 mt-4">
              {keyword ? `Resultados para "${keyword}"` : 'Produtos Disponíveis'}
            </h2>
          </div>
          <Row className="g-4">
            {data.products.map((product) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 shadow-sm border-0">
                  <Product product={product} />
                </Card>
              </Col>
            ))}
          </Row>
          <div className="mt-5">
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ''}
            />
          </div>
        </>
      )}

      <style jsx>{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
