import { useEffect, useState } from 'react'
import saleService from '../services/sale.service'

function SalesPage() {
  const [sales, setSales] = useState([])

  const [formData, setFormData] = useState({
    userId: '',
    date: ''
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSales = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await saleService.getAllSales()
      setSales(response.data)
    } catch (error) {
      console.error('Error fetching sales:', error)
      setError('No fue posible cargar las ventas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleOpenCreate = () => {
    setSelectedSale(null)

    setFormData({
      userId: '',
      date: ''
    })

    setIsFormOpen(true)
  }

  const handleEditSale = (sale) => {
    setSelectedSale(sale)

    setFormData({
      userId: sale.userId,
      date: sale.date
        ? new Date(sale.date).toISOString().slice(0, 16)
        : ''
    })

    setIsFormOpen(true)
  }

  const handleCreateSale = async (event) => {
    event.preventDefault()

    try {
      const saleData = {
        userId: Number(formData.userId),
        date: formData.date || undefined
      }

      await saleService.createSale(saleData)

      await loadSales()

      setIsFormOpen(false)

      setFormData({
        userId: '',
        date: ''
      })
    } catch (error) {
      console.error('Error creating sale:', error)
      setError('No fue posible crear la venta.')
    }
  }

  const handleUpdateSale = async (event) => {
    event.preventDefault()

    try {
      const saleData = {
        userId: Number(formData.userId),
        date: formData.date || undefined
      }

      await saleService.updateSale(selectedSale.id, saleData)

      await loadSales()

      setIsFormOpen(false)
      setSelectedSale(null)

      setFormData({
        userId: '',
        date: ''
      })
    } catch (error) {
      console.error('Error updating sale:', error)
      setError('No fue posible actualizar la venta.')
    }
  }

  const handleDeleteSale = async (id) => {
    const confirmDelete = window.confirm(
      '¿Está seguro de eliminar esta venta?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await saleService.deleteSale(id)

      await loadSales()
    } catch (error) {
      console.error('Error deleting sale:', error)
      setError('No fue posible eliminar la venta.')
    }
  }

  const handleCancelForm = () => {
    setIsFormOpen(false)
    setSelectedSale(null)

    setFormData({
      userId: '',
      date: ''
    })
  }

  if (loading) {
    return <p>Cargando ventas...</p>
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Ventas</h2>
          <p className="text-muted mb-0">
            Gestión de ventas de MarketSoft.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          Nueva venta
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              {selectedSale ? 'Editar venta' : 'Nueva venta'}
            </h5>

            <form
              onSubmit={
                selectedSale
                  ? handleUpdateSale
                  : handleCreateSale
              }
            >
              <div className="mb-3">
                <label className="form-label">
                  Usuario
                </label>

                <input
                  type="number"
                  name="userId"
                  className="form-control"
                  value={formData.userId}
                  onChange={handleFormChange}
                  min="1"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Fecha
                </label>

                <input
                  type="datetime-local"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleFormChange}
                />
              </div>

              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={handleCancelForm}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                {selectedSale ? 'Actualizar' : 'Guardar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {sales.length === 0 ? (
        <div className="alert alert-info">
          No hay ventas registradas.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>

                  <td>
                    {sale.user?.name || sale.userId}
                  </td>

                  <td>
                    {sale.date
                      ? new Date(sale.date).toLocaleString()
                      : 'Sin fecha'}
                  </td>

                  <td>
                    ${Number(sale.total || 0).toFixed(2)}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditSale(sale)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleDeleteSale(sale.id)
                      }
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

export default SalesPage