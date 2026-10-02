import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import UsersPage from './pages/UsersPage'
import ProvidersPage from './pages/ProvidersPage'
import SalesPage from './pages/SalesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="sales" element={<SalesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App