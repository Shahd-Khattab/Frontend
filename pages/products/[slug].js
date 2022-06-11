import Error from "next/error";
import { useRouter } from "next/router";
import Product from "../../components/Product";
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

function ProductPageContainer({ product }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const PUBLIC_KEY= "pk_test_51L3VYgKqeiMl7ByHxz6yT5y2hd1T44bZfIScbgz50JkJkbuStKovE8r1aaDnXKThgdjjda0loltrXPQ8tjoE5bIH00894ZjJ2j";
  const stripeTestPromise= loadStripe(PUBLIC_KEY);

  return (
    <Elements stripe= {stripeTestPromise}>
    <Product
      id={product.id}
      name = {product.name}
      size = {product.size}
      image = {product.image}
      slug = {product.slug}
      price = {product.price}
      stock = {product.stock}
      category = {product.category}
      measurement = {product.measurement}
      weight = {product.weight}
    />
    </Elements>
  );
}

export async function getStaticProps({ params }) {
  const productSlug = params.slug;
  const response = await fetch(`https://se-lecture-8-node-vercel-h814dy0vt-desoukya-gmailcom.vercel.app/api/products/${productSlug}`);
  const data = await response.text()
  const product = JSON.parse(data);
  return {
    props: {
      product,
    },
  };
}

// pages/products/[slug]
export async function getStaticPaths() {
  const response = await fetch('https://se-lecture-8-node-vercel-h814dy0vt-desoukya-gmailcom.vercel.app/api/products');
  const data = await response.text()
  const products = JSON.parse(data);
  const paths = products.map((product) => ({ params: { slug: String(product.id) }}))
  return {
    paths,
    fallback: false,
  }
}
export default ProductPageContainer;
