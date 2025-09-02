# NearMe - Progressive Web App

Una aplicación web moderna para encontrar productos y tiendas cercanas, construida con JavaScript vanilla y tecnologías web modernas.

## 🚀 Características

- **Búsqueda de Productos**: Busca productos en múltiples tiendas
- **Descubrimiento de Tiendas**: Encuentra tiendas cerca de tu ubicación
- **Gestión de Tiendas**: Dashboard para propietarios de tiendas
- **Integración Excel**: Carga masiva de productos vía archivos Excel
- **Estadísticas en Tiempo Real**: Rastrea el rendimiento de la tienda
- **Actividad Reciente**: Monitorea actividades del usuario
- **Diseño Responsivo**: Funciona perfectamente en escritorio y móvil
- **PWA**: Instalable como aplicación nativa

## 🛠️ Tecnologías

### Frontend

- **JavaScript ES6+**: JavaScript moderno sin frameworks
- **Vite**: Herramienta de construcción rápida
- **Tailwind CSS**: Framework CSS utility-first
- **Bootstrap 5**: Biblioteca de componentes UI
- **Leaflet.js**: Mapas interactivos
- **FontAwesome**: Librería de iconos
- **Google Fonts**: Tipografía (Inter)

### PWA Features

- **Service Worker**: Funcionalidad offline
- **Web App Manifest**: Instalación como app nativa
- **Responsive Design**: Optimizado para móviles
- **Push Notifications**: Notificaciones (futuro)

## 👥 Equipo de Desarrollo

**Desarrollador Principal**: Sebastian Rodelo Clan Cienaga Riwi CC 1043637240  
**Equipo**: DevTitan  
**Proyecto**: NearMe Frontend Application

## 🚀 Despliegue en Railway

### Configuración Automática

El proyecto está configurado para desplegarse automáticamente en Railway:

1. **Conecta tu repositorio** a Railway
2. **Railway detectará automáticamente** la configuración
3. **El despliegue se realizará** automáticamente

### Variables de Entorno

```bash
# Railway configurará automáticamente:
PORT=3000
NODE_ENV=production
```

### Scripts de Despliegue

```json
{
  "start": "npm run preview",
  "preview": "vite preview --host 0.0.0.0 --port $PORT"
}
```

## 📱 PWA - Aplicación Web Progresiva

### Instalación

1. **Abre la aplicación** en tu navegador móvil
2. **Busca el ícono "Instalar"** en la barra de direcciones
3. **Toca "Instalar"** para agregar a tu pantalla de inicio
4. **¡Listo!** La app funcionará como una aplicación nativa

### Características PWA

- ✅ **Instalable**: Se puede instalar en dispositivos móviles
- ✅ **Offline**: Funciona sin conexión a internet
- ✅ **Responsive**: Optimizada para todos los tamaños de pantalla
- ✅ **Fast Loading**: Carga rápida con service worker
- ✅ **App-like**: Experiencia similar a aplicación nativa

## 🏗️ Estructura del Proyecto

```
src/
├── auth/           # Gestión de autenticación
├── components/     # Componentes UI reutilizables
├── pages/          # Componentes de páginas
├── router/         # Enrutamiento del lado del cliente
├── services/       # Servicios API y gestión de datos
└── utils/          # Funciones utilitarias

public/
├── manifest.json   # Configuración PWA
├── sw.js          # Service Worker
└── img/           # Imágenes e iconos
```

## 🚀 Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de producción
npm run preview

# Linting
npm run lint
```

## 📱 Optimización Móvil

### Meta Tags

- **Viewport**: Optimizado para dispositivos móviles
- **Theme Color**: Color de tema consistente
- **Apple Touch Icon**: Icono para iOS
- **Manifest**: Configuración PWA completa

### Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Touch Friendly**: Botones y elementos táctiles
- **Fast Loading**: Carga rápida en conexiones lentas
- **Offline Support**: Funciona sin conexión

## 🔧 Configuración de Railway

### Archivo railway.json

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "healthcheckPath": "/"
  }
}
```

### Variables de Entorno

Railway configurará automáticamente:

- `PORT`: Puerto del servidor
- `NODE_ENV`: Entorno de producción

## 📊 Características para Clientes

- 🔍 **Búsqueda de productos** en múltiples tiendas
- 🗺️ **Mapas interactivos** para ubicaciones
- 📱 **Contacto directo** vía WhatsApp/Email
- 📱 **Diseño responsive** para móvil y escritorio

## 🏪 Características para Propietarios

- 📊 **Dashboard completo** con estadísticas
- 📦 **Gestión de productos** (agregar, editar, eliminar)
- 📊 **Carga masiva Excel** de productos
- 📈 **Monitoreo de actividad** en tiempo real
- 📊 **Analíticas de rendimiento** de la tienda

## 🚀 Despliegue

### Railway (Recomendado)

1. Conecta tu repositorio a Railway
2. Railway detectará automáticamente la configuración
3. El despliegue se realizará automáticamente

### Otros Proveedores

- **Vercel**: `npm run build` → `npm run preview`
- **Netlify**: Configurar build command
- **Heroku**: Usar buildpack de Node.js

## 📄 Licencia

Este proyecto es software propietario desarrollado por el equipo DevTitan.

---

**Desarrollado con ❤️ por DevTitan Team**
