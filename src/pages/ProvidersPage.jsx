import { useEffect, useState } from 'react'
import providerService from '../services/provider.service'

function ProvidersPage() {
  const [providers, setProviders] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  })

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

 const loadProviders = async () => {
  try {
    const response = await providerService.getAllProviders()
    setProviders(response.data)
  } catch (error) {
    console.error('Error fetching providers:', error)
    setError('No fue posible cargar los proveedores.')
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  loadProviders()
}, [])

  const handleFormChange = (event) => {
  const { name, value } = event.target

  setFormData((prevData) => ({
    ...prevData,
    [name]: value
  }))
}

const handleCreateProvider = async (event) => {
  event.preventDefault()

  try {
    await providerService.createProvider(formData)

    await loadProviders()

    setIsCreateOpen(false)

    setFormData({
      name: '',
      phone: '',
      email: '',
      city: ''
    })
  } catch (error) {
    console.error('Error creating provider:', error)
  }
}

const handleEditProvider = (provider) => {
  setSelectedProvider(provider)

  setFormData({
    name: provider.name,
    phone: provider.phone,
    email: provider.email,
    city: provider.city
  })

  setIsCreateOpen(true)
}

const handleUpdateProvider = async (event) => {
  event.preventDefault()

  try {
    await providerService.updateProvider(
      selectedProvider.id,
      formData
    )

    await loadProviders()

    setIsCreateOpen(false)
    setSelectedProvider(null)

    setFormData({
      name: '',
      phone: '',
      email: '',
      city: ''
    })
  } catch (error) {
    console.error('Error updating provider:', error)
  }
}

const handleDeleteProvider = async (id) => {
  try {
    await providerService.deleteProvider(id)

    await loadProviders()
  } catch (error) {
    console.error('Error deleting provider:', error)
  }
}

  if (loading) {
    return <p>Cargando proveedores...</p>
  }

  if (error) {
    return <p className="text-danger">{error}</p>
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Proveedores</h2>
          <p className="text-muted mb-0">
            Gestión de proveedores de MarketSoft.
          </p>
        </div>

   <button
      className="btn btn-primary"
      onClick={() => {
        setFormData({
          name: '',
          phone: '',
          email: '',
          city: ''
        })
        setIsCreateOpen(true)
      }}
    >
      Nuevo proveedor
    </button>
  </div>

{isCreateOpen && (
  <div className="card mb-4">
    <div className="card-body">
        <h5 className="card-title">
            {selectedProvider ? 'Editar proveedor' : 'Nuevo proveedor'}
        </h5>

        <form
            onSubmit={selectedProvider ? handleUpdateProvider : handleCreateProvider}
        >
        <div className="mb-3">
          <label className="form-label">
            Nombre
          </label>

          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleFormChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Teléfono
          </label>

          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleFormChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Correo electrónico
          </label>

          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleFormChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Ciudad
          </label>

          <input
            type="text"
            name="city"
            className="form-control"
            value={formData.city}
            onChange={handleFormChange}
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={() => setIsCreateOpen(false)}
        >
          Cancelar
        </button>

        <button type="submit" className="btn btn-primary">
            {selectedProvider ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  </div>
)}

      {providers.length === 0 ? (
        <div className="alert alert-info">
          No hay proveedores registrados.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Ciudad</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td>{provider.id}</td>
                  <td>{provider.name}</td>
                  <td>{provider.phone}</td>
                  <td>{provider.email}</td>
                  <td>{provider.city}</td>
                  <td>
                    <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditProvider(provider)}
                    >
                        Editar
                    </button>

                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProvider(provider.id)}
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

export default ProvidersPage