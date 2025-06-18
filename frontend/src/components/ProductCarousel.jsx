import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <Carousel pause='hover'
        indicators={true}
        prevIcon={<FaChevronLeft className="carousel-control-icon" />}
        nextIcon={<FaChevronRight className="carousel-control-icon" />}>
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <div className="position-relative h-100">
              <Link to={`/product/${product._id}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    filter: 'brightness(0.7)'
                  }}
                />
                <Carousel.Caption style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  textAlign: 'left',
                  padding: '2rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                }}>
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    {product.price.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                  <Link
                    to={`/product/${product._id}`}
                    className="btn btn-primary"
                    style={{
                      padding: '0.5rem 1.5rem',
                      borderRadius: '50px',
                      fontWeight: '600'
                    }}
                  >
                    Ver Detalhes
                  </Link>
                </Carousel.Caption>
              </Link>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <style>{`
        .carousel-control-icon {
          background-color: rgba(0,0,0,0.3);
          padding: 10px;
          border-radius: 50%;
          color: white;
        }
        .carousel-control-prev, .carousel-control-next {
          width: 5%;
        }
        .carousel-indicators button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
};

export default ProductCarousel;
