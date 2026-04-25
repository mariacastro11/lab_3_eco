# Rappi Ecosystem - Lab 3

Aplicación web completa orientada a servicios de entrega a domicilio. La plataforma cuenta con una arquitectura dividida en un Frontend desarrollado en React y un Backend basado en Node.js y Express. El sistema está diseñado para gestionar el flujo de operaciones entre tres actores principales: Consumidores, Tiendas y Repartidores.

---

## Funcionalidades por Rol

### 1. Consumidor (Consumer)
- **Exploración de Tiendas:** Acceso al directorio de establecimientos asociados a la plataforma.
- **Catálogo de Productos:** Consulta del inventario y oferta de artículos por tienda.
- **Carrito de Compras:** Gestión de productos seleccionados, cálculo de totales y confirmación de órdenes.
- **Historial de Pedidos:** Registro detallado de transacciones previas.
- **Seguimiento (Tracking):** Monitoreo geolocalizado en tiempo real del estado de la orden en curso.

### 2. Tienda (Store)
- **Gestión de Establecimiento:** Administración del perfil y configuración básica de la tienda.
- **Control de Inventario:** Operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre el catálogo de productos.
- **Recepción de Órdenes:** Panel de administración para visualizar pedidos entrantes y actualizar sus estados de preparación.

### 3. Repartidor (Delivery)
- **Bolsa de Trabajo:** Visualización de órdenes pendientes de recolección y entrega.
- **Gestión de Entregas:** Asignación de pedidos y actualización de los diferentes estados logísticos.
- **Transmisión de Ubicación:** Emisión de coordenadas en tiempo real para informar al consumidor sobre el progreso del envío.

---

## Stack Tecnológico

### Frontend
- **Framework:** React + Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Enrutamiento:** React Router DOM
- **Geolocalización y Mapas:** Leaflet / React Leaflet
- **Cliente HTTP:** Axios
- **Autenticación y Backend-as-a-Service:** Supabase JS

### Backend
- **Entorno de Ejecución:** Node.js
- **Framework:** Express
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **Servicios Integrados:** Supabase (Autenticación de usuarios y persistencia de datos)
- **Control de Errores:** `@hapi/boom`
- **Controlador de Base de Datos:** `pg`

---

## Estructura del Repositorio

El proyecto se estructura en dos componentes independientes principales:

- `/frontend`: Contiene la lógica de interfaz de usuario y consumo de APIs.
- `/backend`: Contiene la lógica de negocio, reglas de autorización y exposición de servicios REST.

## Instrucciones de Instalación y Ejecución

Para desplegar el entorno de desarrollo local, es necesario inicializar ambos servicios.

### Configuración del Backend

1. Ingresar al directorio correspondiente:
   ```bash
   cd backend
   ```
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Configurar el entorno: Crear un archivo `.env` en la raíz de `/backend` con los parámetros de conexión requeridos (Supabase, variables de base de datos y puertos de ejecución).
4. Inicializar el servidor:
   ```bash
   npm run dev
   ```

### Configuración del Frontend

1. Ingresar al directorio correspondiente:
   ```bash
   cd frontend
   ```
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Configurar el entorno: Crear un archivo `.env` en la raíz de `/frontend` y proveer las variables de entorno para la comunicación con el Backend y con Supabase.
4. Inicializar el cliente web:
   ```bash
   npm run dev
   ```
