import { useState, useEffect } from "react";

import { supabase } from "./lib/supabaseClient";
import "./App.css";

function App() {
  const [products, setProducts] = useState(null);
  const [users, setUsers] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [cart, setCart] = useState({});

  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, display_name");

      if (error) {
        console.error("Error fetching users from Supabase:", error);
        return;
      }

      const nextUsers = data ?? [];
      setUsers(nextUsers);

      const defaultUser = nextUsers[0] || null;
      setSelectedUserId(defaultUser.id);
      const toast = defaultUser
        ? `Logged in as ${defaultUser.display_name}`
        : "No default user as there are no users";
      setToast(toast);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category");

      if (error) {
        console.error("Error fetching products from Supabase:", error);
        return;
      }

      setProducts(data ?? []);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, selectedId) => {
    if (!selectedUserId) {
      console.warn("Please select a user before adding products.");
      return;
    }
    const qty = Number(e.target.value);

    if (!qty || qty <= 0) {
      console.warn("Please enter a valid quantity.");
      return;
    }

    setCart((prevCart) => {
      const currentUserCart = prevCart[selectedUserId] ?? {};

      return {
        ...prevCart,
        [selectedUserId]: {
          ...currentUserCart,
          [selectedId]: qty,
        },
      };
    });
  };

  const handleSubmitOrder = async () => {
    if (!selectedUserId) {
      console.warn("Please select a user before submitting the order.");
      return;
    }

    const userOrder = cart[selectedUserId] ?? {};

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const deliveryDateString = deliveryDate.toISOString().slice(0, 10);

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: selectedUserId,
        delivery_date: deliveryDateString,
      })
      .select();

    if (orderError) {
      console.error("Insert failed:", orderError.message);
      setToast("Insert failed");
      return;
    }

    const orderId = orderData?.[0]?.id;

    if (!orderId) {
      console.error("No order id returned");
      setToast("No order id returned");
      return;
    }

    const orderItems = Object.entries(userOrder).map(
      ([productId, quantity]) => ({
        order_id: orderId,
        product_id: Number(productId),
        quantity: Number(quantity),
      }),
    );

    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.error("Order items insert failed:", itemsError.message);
      setToast("Order items failed");
      return;
    }

    console.log("Order created:", orderData);
    console.log("Order items created:", itemsData);
    setToast("Order submitted");
  };

  return (
    <div className="screen">
      <div className="two-compartments">
        <div>
          <div className="order-header">
            <h2>Products</h2>
            <button
              type="button"
              className="submit-order"
              onClick={handleSubmitOrder}
              disabled={
                !selectedUserId ||
                !cart[selectedUserId] ||
                Object.keys(cart[selectedUserId] ?? {}).length === 0
              }
            >
              Submit order
            </button>
          </div>

          <div className="products-container">
            {products === null ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              products.map((product) => (
                <article key={product.id}>
                  <div className="title-and-cat">
                    <h3>{product.name}</h3>
                    <p className="cat">{product.category}</p>
                  </div>
                  <p>€{Number(product.price).toFixed(2)}</p>

                  <div className="qty-block">
                    <input
                      type="number"
                      min="1"
                      defaultValue={0}
                      onChange={(e) => handleAddToCart(e, product.id)}
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedProductId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div>
          <label htmlFor="user-select">Select user</label>
          {users === null ? (
            <p>Loading users...</p>
          ) : (
            <select
              id="user-select"
              value={selectedUserId ?? ""}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              <option value="">Choose a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.display_name} (@{user.username})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <h4 className="toast">{toast}</h4>
    </div>
  );
}

export default App;
