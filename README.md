# MarketSoft - Frontend

Aplicación web desarrollada para el sistema de gestión de supermercado **MarketSoft**.

El proyecto corresponde a una **Single Page Application (SPA)** desarrollada con React, que consume mediante Axios la API REST del backend del sistema.

## Integrantes

- Daniela Cifuentes Rendón
- Alejandra Salazar Cardona
- María Paulina Clavijo Salazar

## Tecnologías utilizadas

- React
- Axios
- Bootstrap
- React Router DOM
- Vite
- JavaScript

## Módulos del sistema

La aplicación permite gestionar los siguientes módulos:

- Productos
- Usuarios
- Proveedores
- Ventas

Cada módulo permite realizar las operaciones CRUD:

- Visualizar registros
- Crear registros
- Actualizar registros
- Eliminar registros

## Arquitectura

El proyecto utiliza una estructura organizada por responsabilidades:

src/
├── components/
│   └── layout/
│       └── MainLayout.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProvidersPage.jsx
│   ├── UsersPage.jsx
│   └── SalesPage.jsx
│
├── services/
│   ├── api.js
│   ├── product.service.js
│   ├── provider.service.js
│   ├── user.service.js
│   └── sale.service.js
│
├── styles/
│   └── global.css
│
├── App.jsx
└── main.jsx