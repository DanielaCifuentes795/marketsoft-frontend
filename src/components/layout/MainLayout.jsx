import { createElement } from 'react'
import { Link, Outlet } from 'react-router-dom'

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Users', to: '/users' },
  { label: 'Products', to: '/products' },
  { label: 'Providers', to: '/providers' },
  { label: 'Sales', to: '/sales' },
]

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7f8',
    color: '#202a33',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    width: '240px',
    padding: '28px 18px',
    backgroundColor: '#173c36',
    color: '#f4f8f6',
  },
  brand: {
    margin: '0 10px 36px',
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  navLabel: {
    margin: '0 10px 10px',
    color: '#a9c3bc',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'grid',
    gap: '4px',
  },
  navLink: {
    display: 'block',
    padding: '10px',
    borderRadius: '4px',
    color: '#e3ece9',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
  },
  workspace: {
    display: 'flex',
    minWidth: 0,
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    minHeight: '72px',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid #e2e7e9',
    backgroundColor: '#fff',
  },
  headerTitle: {
    margin: 0,
    color: '#202a33',
    fontSize: '18px',
    fontWeight: 650,
  },
  headerLabel: {
    color: '#64727a',
    fontSize: '13px',
  },
  main: {
    width: '100%',
    flex: 1,
    padding: '32px',
  },
}

function MainLayout() {
  return createElement(
    'div',
    { style: styles.shell },
    createElement(
      'aside',
      { style: styles.sidebar, 'aria-label': 'Main navigation' },
      createElement('div', { style: styles.brand }, 'MarketSoft'),
      createElement('div', { style: styles.navLabel }, 'Workspace'),
      createElement(
        'nav',
        { style: styles.nav },
        navigationItems.map((item) =>
          createElement(
            Link,
            { key: item.to, to: item.to, style: styles.navLink },
            item.label,
          ),
        ),
      ),
    ),
    createElement(
      'div',
      { style: styles.workspace },
      createElement(
        'header',
        { style: styles.header },
        createElement('h1', { style: styles.headerTitle }, 'Dashboard'),
        createElement(
          'span',
          { style: styles.headerLabel },
          'Sistema de gestión de supermercado',
        ),
      ),
      createElement(
        'main',
        { style: styles.main },
        createElement(Outlet),
      ),
    ),
  )
}

export default MainLayout