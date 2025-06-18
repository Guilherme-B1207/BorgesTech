import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react'
import Rating from './Rating';

const Product = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Card className='my-3 p-3 rounded' style={{
      height: '460px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: 'none',
      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      overflow: 'hidden',
      position: 'relative',
      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      zIndex: isHovered ? 10 : 1,
    }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #2d3748 0%, #e2e8f0 100%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
      <Link to={`/product/${product._id}`} style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        position: 'relative',
      }}>

        <Card.Img src={product.image} variant='top' style={{
          maxHeight: '200px',
          width: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 2,
        }} />
      </Link>

      <Card.Body style={{ flex: '0' }}>
        <Link to={`/product/${product._id}`} style={{
          textDecoration: 'none',
          color: '#212529',
          flex: '1',
        }}>
          <Card.Title as='div' className='product-title' style={{
            height: '60px', overflow: 'hidden', color: isHovered ? '#3C4C5D' : '#212529', overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4', marginBottom: '10px', fontWeight: '500', transition: 'color 0.3s ease',
          }}>
            {product.name}
          </Card.Title>
        </Link>
        <div style={{
          margin: '8px 0 12px',
          opacity: isHovered ? 1 : 0.9,
          transition: 'opacity 0.3s ease',
        }}></div>
        <Card.Text as='div' style={{ margin: '10px 0' }}>
          <Rating
            value={product.rating}
            text={`${product.numReviews} avaliações`}
            starColor="#ffc107"
            textColor="#6c757d"
          />
        </Card.Text>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 'auto',
        }}></div>

        <Card.Text as='h3' style={{
          marginTop: '10px', fontSize: '1.5rem',
          margin: 0,
          letterSpacing: '-0.5px'
        }}>
          {product?.price?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) || 'Grátis'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;