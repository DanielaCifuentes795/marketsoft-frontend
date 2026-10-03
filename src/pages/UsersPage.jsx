import { useEffect, useState } from 'react'
import userService from '../services/user.service'

function UsersPage() {
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await userService.getAllUsers()
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('No fue posible cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleOpenCreate = () => {
    setSelectedUser(null)

    setFormData({
      name: '',
      email: '',
      role: ''
    })

    setIsFormOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || ''
    })

    setIsFormOpen(true)
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      }

      await userService.createUser(userData)

      await loadUsers()

      setIsFormOpen(false)

      setFormData({
        name: '',
        email: '',
        role: ''
      })
    } catch (error) {
      console.error('Error creating user:', error)
      setError(
        error.response?.data?.message ||
        'No fue posible crear el usuario.'
      )
    }
  }

  const handleUpdateUser = async (event) => {
    event.preventDefault()

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      }

      await userService.updateUser(
        selectedUser.id,
        userData
      )

      await loadUsers()

      setIsFormOpen(false)
      setSelectedUser(null)

      setFormData({
        name: '',
        email: '',
        role: ''
      })
    } catch (error) {
      console.error('Error updating user:', error)
      setError(
        error.response?.data?.message ||
        'No fue posible actualizar el usuario.'
      )
    }
  }

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      '¿Está seguro de eliminar este usuario?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await userService.deleteUser(id)

      await loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      setError(
        error.response?.data?.message ||
        'No fue posible eliminar el usuario.'
      )
    }
  }

  const handleCancelForm = () => {
    setIsFormOpen(false)
    setSelectedUser(null)

    setFormData({
      name: '',
      email: '',
      role: ''
    })
  }

  if (loading) {
    return <p>Cargando usuarios...</p>
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Usuarios</h2>

          <p className="text-muted mb-0">
            Gestión de usuarios de MarketSoft.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          Nuevo usuario
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
              {selectedUser
                ? 'Editar usuario'
                : 'Nuevo usuario'}
            </h5>

            <form
              onSubmit={
                selectedUser
                  ? handleUpdateUser
                  : handleCreateUser
              }
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
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Correo
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Rol
                </label>

                <input
                  type="text"
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleFormChange}
                  placeholder="Ejemplo: user"
                  required
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
                {selectedUser
                  ? 'Actualizar'
                  : 'Guardar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <div className="alert alert-info">
          No hay usuarios registrados.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        handleEditUser(user)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleDeleteUser(user.id)
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

export default UsersPage