import axios from 'axios'
import { useEffect, useState } from 'react'
import { Form, redirect } from 'react-router'
import './App.css'

interface Product {
  id: number
  name: string
  price: number
}

interface ProductFormData {
  name: string
  price: number
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [isShow, setIsShow] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/products')
        if (response.status !== 200) throw new Error('Có lỗi khi lấy dữ liệu')
        setProducts(response.data)
      } catch (error) {
        alert((error as Error).message)
      }
    }
    if (isShow) fetchData()
  }, [isShow])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    try {
      await axios.delete(`http://localhost:3000/products/${id}`)
      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      alert((error as Error).message)
    }
  }

  function showItemHandler() {
    setIsShow(!isShow)
  }

  return (
    <>
      <div className='container'>
        <Form
          method='post'
          key={editingProduct ? editingProduct.id : 'new'}
          className='product-form'
        >
          {editingProduct && (
            <input type='hidden' name='id' defaultValue={editingProduct.id} />
          )}
          <div>
            <input
              type='text'
              name='name'
              placeholder='Tên sản phẩm'
              defaultValue={editingProduct?.name || ''}
            />
          </div>
          <div>
            <input
              type='number'
              name='price'
              placeholder='Giá sản phẩm'
              defaultValue={editingProduct?.price || ''}
            />
          </div>
          <button type='submit'>
            {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
          {editingProduct && (
            <button
              type='button'
              onClick={() => {
                setEditingProduct(null)
              }}
              className='cancel-btn'
            >
              Hủy
            </button>
          )}
        </Form>

        <button className='toggle-btn' onClick={showItemHandler}>
          {isShow ? 'Ẩn sản phẩm' : 'Xem sản phẩm'}
        </button>

        {isShow && (
          <table className='product-table'>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <Item
                  key={product.id}
                  product={product}
                  onEdit={setEditingProduct}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export async function productAction({ request }: { request: Request }) {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const price = Number(formData.get('price'))
  const id = formData.get('id')
  try {
    if (id) {
      const response = await axios.put(`http://localhost:3000/products/${id}`, {
        name,
        price
      })
      if (response.status !== 200)
        throw new Error('Không thể cập nhật sản phẩm')
    } else {
      const response = await axios.post('http://localhost:3000/products', {
        name,
        price
      })
      if (response.status !== 201) throw new Error('Không thể thêm sản phẩm')
    }
    return redirect('/')
  } catch (error) {
    alert((error as Error).message)
    return null
  }
}

interface ItemProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

function Item({ product, onEdit, onDelete }: ItemProps) {
  return (
    <tr>
      <td>{product.name}</td>
      <td>{product.price}</td>
      <td>
        <button className='edit-btn' onClick={() => onEdit(product)}>
          Sửa
        </button>
        <button className='delete-btn' onClick={() => onDelete(product.id)}>
          Xóa
        </button>
      </td>
    </tr>
  )
}
