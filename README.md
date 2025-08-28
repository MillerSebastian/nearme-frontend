# NearMe - Plataforma de Búsqueda de Tiendas

## 📋 Descripción

NearMe es una plataforma web que permite a los usuarios buscar tiendas cercanas y sus productos. Los comerciantes pueden registrar sus tiendas, gestionar inventarios y subir productos masivamente mediante archivos Excel.

## 🚀 Características

- **Búsqueda de Tiendas**: Encuentra tiendas por nombre, tipo y ubicación
- **Gestión de Productos**: Añade, edita y elimina productos de tu inventario
- **Carga Masiva**: Importa productos desde archivos Excel
- **Dashboard Interactivo**: Estadísticas y gestión completa de tu tienda
- **Autenticación**: Sistema de registro y login para comerciantes
- **Responsive Design**: Interfaz adaptada para móviles y desktop

## 🛠️ Tecnologías

- **Frontend**: Vanilla JavaScript ES6, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MySQL
- **Librerías**: Leaflet.js (mapas), SheetJS (Excel), Chart.js
- **Build Tool**: Vite
- **Routing**: SPA con hash-based navigation

## 📦 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- Navegador moderno

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd Nearme/project
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar la base de datos**

   - Crear base de datos MySQL
   - Ejecutar los scripts SQL proporcionados
   - Configurar variables de entorno del backend

4. **Iniciar el desarrollo**

   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 📊 Estructura de la Base de Datos

### Tabla `stores`

```sql
CREATE TABLE stores (
  nit_store VARCHAR(20) PRIMARY KEY,
  store_name VARCHAR(100) NOT NULL,
  address TEXT,
  phone_number VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  id_store_type INT,
  opening_hours TIME,
  closing_hours TIME,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla `products`

```sql
CREATE TABLE products (
  id_product INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(250) UNIQUE,
  price DECIMAL(12,2),
  category VARCHAR(100),
  id_store VARCHAR(20),
  sold_out BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_store) REFERENCES stores(nit_store) ON DELETE SET NULL ON UPDATE CASCADE
);
```

## 📁 Estructura del Proyecto

```
project/
├── src/
│   ├── auth/
│   │   └── AuthManager.js          # Gestión de autenticación
│   ├── components/
│   │   ├── ExcelUpload.js          # Componente de carga Excel
│   │   ├── Header.js               # Header de navegación
│   │   ├── Map.js                  # Componente de mapas
│   │   ├── SearchBar.js            # Barra de búsqueda
│   │   └── StoreList.js            # Lista de tiendas
│   ├── config/
│   │   └── api.js                  # Configuración de API
│   ├── pages/
│   │   ├── dashboard.js            # Dashboard principal
│   │   ├── home.js                 # Página de inicio
│   │   ├── login.js                # Página de login
│   │   ├── register.js             # Página de registro
│   │   └── upload-products.js      # Página de carga de productos
│   ├── router/
│   │   └── Router.js               # Sistema de routing
│   ├── index.css                   # Estilos globales
│   └── main.js                     # Punto de entrada
├── index.html                      # HTML principal
├── package.json                    # Dependencias
├── vite.config.ts                  # Configuración de Vite
└── tailwind.config.js              # Configuración de Tailwind
```

## 🔌 API Endpoints

### Stores (Tiendas)

- `GET /api/stores` - Obtener todas las tiendas
- `GET /api/stores/:nit` - Obtener tienda por NIT
- `POST /api/stores` - Crear nueva tienda
- `PUT /api/stores/:nit` - Actualizar tienda
- `DELETE /api/stores/:nit` - Eliminar tienda

### Products (Productos)

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `PATCH /api/products/:id/status` - Cambiar estado de agotado/en stock
- `DELETE /api/products/:id` - Eliminar producto

### Store Views/Contacts (Consultas de Tienda)

- `POST /api/store-views` - Registrar nueva consulta/contacto
- `GET /api/store-views/stats/:store_id` - Obtener estadísticas de consultas por tienda
- `GET /api/store-views/store/:store_id` - Obtener todas las consultas de una tienda
- `GET /api/store-views/global-stats` - Obtener estadísticas globales

## 📊 Formato del Archivo Excel

### Campos Requeridos

- **Nombre del Producto** (texto): Nombre del producto
- **Precio** (número): Precio sin símbolos de moneda (ej: 15000)
- **Categoría** (texto): Una de las categorías disponibles

### Campos Opcionales

- **Descripción** (texto): Descripción del producto

### Categorías Disponibles

- Ferretería
- Pintura
- Electricidad
- Plomería
- Construcción
- Jardinería
- Verduras
- Electrónica

### Ejemplo de Estructura

| Nombre del Producto  | Precio | Categoría  | Descripción                            |
| -------------------- | ------ | ---------- | -------------------------------------- |
| Martillo Profesional | 25000  | Ferretería | Martillo de acero con mango ergonómico |
| Pintura Blanca 1L    | 18000  | Pintura    | Pintura acrílica de alta calidad       |

**Nota**: Se incluye un archivo `sample-products.csv` en el proyecto que puedes convertir a Excel (.xlsx) para usar como plantilla.

### Notas Importantes

- La primera fila debe contener los nombres de las columnas (encabezados)
- Los precios deben ser números sin símbolos de moneda
- El archivo debe estar en formato .xlsx o .xls
- Tamaño máximo: 10MB
- Se incluye una plantilla descargable en la interfaz

## 🔐 Flujo de Autenticación

1. **Registro**: El comerciante se registra con datos de su tienda
2. **Login**: Acceso con email y contraseña
3. **Token**: Se genera un token de sesión (almacenado en localStorage)
4. **Validación**: El token se valida en cada petición
5. **Logout**: Se elimina el token y se redirige al login

## 🔄 Flujo de Datos

### Creación de Productos

1. El usuario sube un archivo Excel con productos
2. El sistema mapea las columnas del Excel a los campos requeridos
3. Se valida que los campos obligatorios estén presentes
4. Se envían los productos uno por uno al endpoint `/api/products`
5. El campo `id_store` se establece automáticamente con el `nit_store` del usuario logueado

### Búsqueda de Tiendas

1. El usuario ingresa términos de búsqueda
2. Se obtienen todas las tiendas desde `/api/stores`
3. Se filtran client-side por nombre o tipo de tienda
4. Se muestran los resultados con información básica

### Contacto con Tiendas

1. El usuario selecciona un producto o realiza una búsqueda
2. Hace clic en "Contactar" en la tarjeta de la tienda
3. Se abre un modal con información del producto y campo para nombre
4. El usuario puede elegir entre WhatsApp o Email
5. Se registra la consulta en el sistema via `POST /api/store-views`
6. Se abre la aplicación correspondiente con mensaje personalizado
7. Las estadísticas se muestran en el dashboard del vendedor

## 🐛 Solución de Problemas

### Error de Relación de Datos

Si encuentras errores relacionados con `id_store` y `nit_store`:

- Verifica que el usuario esté correctamente autenticado
- Confirma que `currentUser.nit_store` tenga un valor válido
- Asegúrate de que los productos se estén creando con el `nit_store` correcto

### Problemas de Carga de Productos

- Verifica la conexión con el backend
- Confirma que el endpoint `/api/products` esté funcionando
- Revisa la consola del navegador para errores de red

### Errores de Excel

- Asegúrate de que el archivo esté en formato .xlsx o .xls
- Verifica que la primera fila contenga los encabezados
- Confirma que los campos obligatorios estén presentes
- Revisa que los precios sean números sin símbolos de moneda

## 📝 Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.
