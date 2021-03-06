import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { useHistory } from "react-router";
import { toast } from "react-toastify";

import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";

import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const history = useHistory();
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map((product) => ({
    ...product,
    priceFormatted: formatPrice(product.price), //formatando o preço de cada produto no carrinho
    subTotal: formatPrice(product.price * product.amount), //calculando o subtotal desse produto no carrinho
  }));

  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      sumTotal += product.price * product.amount; //calculando o valor total de todos os produtos no carrinho

      return sumTotal;
    }, 0)
  );

  function handleProductIncrement(product: Product) {
    //adicionando um item a mais desse produto no carrinho
    const incrementArguments = {
      productId: product.id,
      amount: product.amount + 1,
    };

    //atualiando o total de itens desse produto no carrinho
    updateProductAmount(incrementArguments);
  }

  function handleProductDecrement(product: Product) {
    //removendo um item desse produto no carrinho
    const decrementArguments = {
      productId: product.id,
      amount: product.amount - 1,
    };

    //atualiando o total de itens desse produto no carrinho
    updateProductAmount(decrementArguments);
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  function finishOrder() {
    toast('Seu pedido foi finalizado, obrigado!');
    
    history.push('/');
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map((product) => (
            <tr key={product.id} data-testid="product">
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                    disabled={product.amount <= 1}
                    onClick={() => handleProductDecrement(product)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={product.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                    onClick={() => handleProductIncrement(product)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subTotal}</strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button
          onClick={finishOrder} 
          type="button"
        >
          Finalizar pedido
        </button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
