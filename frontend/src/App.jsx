import React, { useEffect, useMemo, useState } from "react";
import { Boxes, PackagePlus, ShoppingCart, Trash2, UserPlus } from "lucide-react";
import { api } from "./api.js";

const emptyProduct = { name: "", sku: "", description: "", price: "", stock_quantity: "" };
const emptyCustomer = { name: "", email: "", phone: "" };

function money(value) {
  return Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [orderForm, setOrderForm] = useState({ customer_id: "", product_id: "", quantity: 1 });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [productData, customerData, orderData] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getOrders(),
      ]);
      setProducts(productData);
      setCustomers(customerData);
      setOrders(orderData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === String(orderForm.product_id)),
    [products, orderForm.product_id]
  );

  const inventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price) * product.stock_quantity,
    0
  );

  async function handleSubmit(event, action, successMessage) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(successMessage);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Inventory & Orders</p>
          <h1>Operations Dashboard</h1>
        </div>
        <div className="stats">
          <div>
            <span>{products.length}</span>
            <small>Products</small>
          </div>
          <div>
            <span>{customers.length}</span>
            <small>Customers</small>
          </div>
          <div>
            <span>{money(inventoryValue)}</span>
            <small>Inventory Value</small>
          </div>
        </div>
      </header>

      {(notice || error) && (
        <div className={error ? "alert error" : "alert success"}>{error || notice}</div>
      )}

      <section className="workspace">
        <form
          className="panel"
          onSubmit={(event) =>
            handleSubmit(
              event,
              async () => {
                await api.createProduct({
                  ...productForm,
                  price: Number(productForm.price),
                  stock_quantity: Number(productForm.stock_quantity),
                });
                setProductForm(emptyProduct);
              },
              "Product saved"
            )
          }
        >
          <div className="panel-title">
            <PackagePlus size={20} />
            <h2>Add Product</h2>
          </div>
          <input required placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          <input required placeholder="SKU" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
          <input placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
          <div className="split">
            <input required type="number" min="0" step="0.01" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
            <input required type="number" min="0" step="1" placeholder="Stock" value={productForm.stock_quantity} onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })} />
          </div>
          <button type="submit">Save Product</button>
        </form>

        <form
          className="panel"
          onSubmit={(event) =>
            handleSubmit(
              event,
              async () => {
                await api.createCustomer(customerForm);
                setCustomerForm(emptyCustomer);
              },
              "Customer saved"
            )
          }
        >
          <div className="panel-title">
            <UserPlus size={20} />
            <h2>Add Customer</h2>
          </div>
          <input required placeholder="Name" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} />
          <input required type="email" placeholder="Email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} />
          <input placeholder="Phone" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} />
          <button type="submit">Save Customer</button>
        </form>

        <form
          className="panel"
          onSubmit={(event) =>
            handleSubmit(
              event,
              async () => {
                await api.createOrder({
                  customer_id: Number(orderForm.customer_id),
                  items: [{ product_id: Number(orderForm.product_id), quantity: Number(orderForm.quantity) }],
                });
                setOrderForm({ customer_id: "", product_id: "", quantity: 1 });
              },
              "Order placed and stock reduced"
            )
          }
        >
          <div className="panel-title">
            <ShoppingCart size={20} />
            <h2>Place Order</h2>
          </div>
          <select required value={orderForm.customer_id} onChange={(e) => setOrderForm({ ...orderForm, customer_id: e.target.value })}>
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
          <select required value={orderForm.product_id} onChange={(e) => setOrderForm({ ...orderForm, product_id: e.target.value })}>
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name} ({product.stock_quantity} available)</option>
            ))}
          </select>
          <input required type="number" min="1" max={selectedProduct?.stock_quantity || undefined} value={orderForm.quantity} onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })} />
          <button type="submit" disabled={!products.length || !customers.length}>Place Order</button>
        </form>
      </section>

      <section className="tables">
        <DataTable
          title="Products"
          icon={<Boxes size={20} />}
          empty="No products yet"
          columns={["Name", "SKU", "Price", "Stock", ""]}
          rows={products.map((product) => [
            product.name,
            product.sku,
            money(product.price),
            product.stock_quantity,
            <button className="icon-button" title="Delete product" onClick={() => handleSubmit({ preventDefault() {} }, () => api.deleteProduct(product.id), "Product deleted")}>
              <Trash2 size={16} />
            </button>,
          ])}
          loading={loading}
        />

        <DataTable
          title="Customers"
          icon={<UserPlus size={20} />}
          empty="No customers yet"
          columns={["Name", "Email", "Phone", ""]}
          rows={customers.map((customer) => [
            customer.name,
            customer.email,
            customer.phone || "-",
            <button className="icon-button" title="Delete customer" onClick={() => handleSubmit({ preventDefault() {} }, () => api.deleteCustomer(customer.id), "Customer deleted")}>
              <Trash2 size={16} />
            </button>,
          ])}
          loading={loading}
        />

        <DataTable
          title="Orders"
          icon={<ShoppingCart size={20} />}
          empty="No orders yet"
          columns={["Order", "Customer", "Items", "Total"]}
          rows={orders.map((order) => [
            `#${order.id}`,
            order.customer.name,
            order.items.map((item) => `${item.product.name} x ${item.quantity}`).join(", "),
            money(order.total_amount),
          ])}
          loading={loading}
        />
      </section>
    </main>
  );
}

function DataTable({ title, icon, columns, rows, empty, loading }) {
  return (
    <section className="table-panel">
      <div className="panel-title">
        {icon}
        <h2>{title}</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length}>Loading...</td></tr>
            ) : rows.length ? (
              rows.map((row, index) => (
                <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
              ))
            ) : (
              <tr><td colSpan={columns.length}>{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default App;
