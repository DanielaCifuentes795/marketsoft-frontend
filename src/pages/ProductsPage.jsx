import { useEffect, useState } from 'react'
import productService from '../services/product.service'
import providerService from '../services/provider.service'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [providers, setProviders] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    providerId: ''
  })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleOpenCreate = () => {
    setSelectedProduct(null)

    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      providerId: ''
    })

    setIsCreateOpen(true)
  }

  const handleCreateProduct = async (event) => {
    event.preventDefault()

    try {
      await productService.createProduct(formData)

      const response = await productService.getAllProducts()
      setProducts(response.data)

      setIsCreateOpen(false)
      setSelectedProduct(null)

      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        providerId: ''
      })
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)

    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      providerId: product.providerId
    })

    setIsCreateOpen(true)
  }

  const handleUpdateProduct = async (event) => {
  event.preventDefault()

    try {
        await productService.updateProduct(
            selectedProduct.id,
            formData
        )

        const response = await productService.getAllProducts()
        setProducts(response.data)

        setIsCreateOpen(false)
        setSelectedProduct(null)

        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            providerId: ''
        })
    } catch (error) {
        console.error('Error updating product:', error)
    }
}

    const handleDeleteProduct = async (id) => {
        try {
            await productService.deleteProduct(id)

            const response = await productService.getAllProducts()
            setProducts(response.data)
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await productService.getAllProducts()
        const providersResponse = await providerService.getAllProviders()

        setProducts(productsResponse.data)
        setProviders(providersResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('No fue posible cargar la información.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <p>Cargando productos...</p>
  }

  if (error) {
    return <p className="text-danger">{error}</p>
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Productos</h2>

          <p className="text-muted mb-0">
            Gestión de productos de MarketSoft.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          Nuevo producto
        </button>
      </div>

      {isCreateOpen && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
                {selectedProduct ? 'Editar producto' : 'Nuevo producto'}
            </h5>

            <form
                onSubmit={
                    selectedProduct
                        ? handleUpdateProduct
                        : handleCreateProduct
                }
            >
              <div className="mb-3">
                <label className="form-label">Nombre</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>

                <input
                  type="text"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Precio</label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleFormChange}
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Stock</label>

                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={formData.stock}
                  onChange={handleFormChange}
                  min="0"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Proveedor</label>

                <select
                  name="providerId"
                  className="form-select"
                  value={formData.providerId}
                  onChange={handleFormChange}
                >
                  <option value="">
                    Seleccione un proveedor
                  </option>

                  {providers.map((provider) => (
                    <option
                      key={provider.id}
                      value={provider.id}
                    >
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => {
                  setIsCreateOpen(false)
                  setSelectedProduct(null)
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
            >
                {selectedProduct ? 'Actualizar' : 'Guardar'}
            </button>
            </form>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="alert alert-info">
          No hay productos registrados.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>{providers.find(
                        (provider) => provider.id === product.providerId
                    )?.name || 'Sin proveedor'}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditProduct(product)}
                    >
                      Editar
                    </button>

                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                    >
                        Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ProductsPage