import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ProductFormData>()

  useEffect(() => {
    if (editingProduct) {
      setValue('name', editingProduct.name)
      setValue('price', editingProduct.price)
    }
  }, [editingProduct, setValue])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/products')
        console.log(response)
        if (response.status !== 200) throw new Error('Có lỗi khi lấy dữ liệu')

        setProducts(response.data)
      } catch (error) {
        alert((error as Error).message)
      }
    }
    if (isShow) fetchData()
  }, [isShow])

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const response = await axios.put(
          `http://localhost:3000/products/${editingProduct.id}`,
          data
        )
        if (response.status !== 200)
          throw new Error('Không thể cập nhật sản phẩm')
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? response.data : p))
        )
        setEditingProduct(null)
      } else {
        // Create new product
        const response = await axios.post(
          'http://localhost:3000/products',
          data
        )
        if (response.status !== 201) throw new Error('Không thể thêm sản phẩm')
        setProducts([...products, response.data])
      }
      reset()
    } catch (error) {
      alert((error as Error).message)
    }
  }

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
        <form onSubmit={handleSubmit(onSubmit)} className='product-form'>
          <div>
            <input
              type='text'
              placeholder='Tên sản phẩm'
              {...register('name', {
                required: 'Tên sản phẩm là bắt buộc',
                minLength: { value: 3, message: 'Tên phải có ít nhất 3 ký tự' }
              })}
            />
            {errors.name && (
              <span className='error'>{errors.name.message}</span>
            )}
          </div>
          <div>
            <input
              type='number'
              placeholder='Giá sản phẩm'
              {...register('price', {
                required: 'Giá sản phẩm là bắt buộc',
                min: { value: 0, message: 'Giá phải lớn hơn 0' }
              })}
            />
            {errors.price && (
              <span className='error'>{errors.price.message}</span>
            )}
          </div>
          <button type='submit'>
            {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
          {editingProduct && (
            <button
              type='button'
              onClick={() => {
                setEditingProduct(null)
                reset()
              }}
              className='cancel-btn'
            >
              Hủy
            </button>
          )}
        </form>

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
