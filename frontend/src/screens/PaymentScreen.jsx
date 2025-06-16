import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, shippingAddress]);

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Método de pagamento</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Selecione o método</Form.Label>
                    <Col>
                        <Form.Check
                            className='my-2'
                            type='radio'
                            label='PayPal'
                            id='PayPal'
                            name='paymentMethod'
                            value='PayPal'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>

                        <Form.Check
                            className='my-2'
                            type='radio'
                            label='Cartão de Crédito'
                            id='Cartão de Crédito'
                            name='paymentMethod'
                            value='Cartão de Crédito'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>

                        <Form.Check
                            className='my-2'
                            type='radio'
                            label='Cartão de Débito'
                            id='Cartão de Débito'
                            name='paymentMethod'
                            value='Cartão de crédito'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>


                        <Form.Check
                            className='my-2'
                            type='radio'
                            label='Pix'
                            id='Pix'
                            name='paymentMethod'
                            value='Pix'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;
