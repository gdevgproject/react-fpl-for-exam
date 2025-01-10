import { ReactDOM, useEffect, useState } from "react";
import React from "react";
import "./App.css";
import axios from "axios";

export default function App() {
  const [products, setProducts] = useState([]);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/products");
        // console.log(typeof response);
        console.log(response);
        if (response.status !== 200) throw new Error("Có lỗi khi lấy dữ liệu");

        // const data = await response.json();
        // console.log(data);
        setProducts(response.data);
      } catch (error) {
        alert(error.message);
      }
    }
    fetchData();
  }, []);

  function showItemHandler() {
    setIsShow(!isShow);
  }

  return (
    <>
      <div className="container">
        <button className="toggle-btn" onClick={showItemHandler}>
          {isShow ? "Ẩn sản phẩm" : "Xem sản phẩm"}
        </button>
        {isShow && (
          <table className="product-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <Item
                  key={product.id}
                  name={product?.name}
                  price={product?.price}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Item({ name, price }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{price}</td>
    </tr>
  );
}
