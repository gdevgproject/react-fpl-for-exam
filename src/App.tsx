import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);

  //   useForm
  // register
  // handleSubmit

  // {...register("name")} takes 2 parameters: primitive and object with key like required: "", min: {value, message}

  // formState: {errors}
  // example: errors.price, ....

  // className="product-form"

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
        alert((error as Error).message);
      }
    }
    if (isShow) fetchData();
  }, [isShow]);

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

interface ItemProps {
  name: string;
  price: number;
}

function Item({ name, price }: ItemProps) {
  return (
    <tr>
      <td>{name}</td>
      <td>{price}</td>
    </tr>
  );
}
