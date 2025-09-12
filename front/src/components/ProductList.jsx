import Box from '@mui/material/Box';
import products from '../data/productsWithTags.js';
import ProductCard from './ProductCard';
console.log(products);

const ProductList = () => (
  <Box
    component="section"
    sx={{
      display: 'grid',
      gap: 3,
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      },
      justifyContent: 'center',
    }}
  >
    {products.map((prod) => (
      <ProductCard key={prod.id} product={prod} />
    ))}
  </Box>
);

export default ProductList;