import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Bem vindo a BorgesTech',
  description: 'Nós vendemos os melhores produtos pelos melhores preços',
  keywords: 'Eletrônicos, comprar eletrônicos, eletrônicos baratos',
};

export default Meta;
