# ClaseIaXpress Backend - Actualizado

Backend actualizado con el modelo Gemini 1.5 Flash para ClaseIaXpress.

## 🚀 Despliegue en Vercel

### 1. Preparar el proyecto
```bash
cd backend-updated
npm install
```

### 2. Configurar variables de entorno en Vercel
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega: `GEMINI_API_KEY` con tu API key de Google AI Studio

### 3. Desplegar
```bash
# Opción A: Desde CLI de Vercel
vercel --prod

# Opción B: Conectar repositorio en Vercel Dashboard
# Sube este código a GitHub y conecta el repo en Vercel
```

## 🔧 Cambios Principales

- ✅ **Modelo actualizado**: `gemini-pro` → `gemini-1.5-flash`
- ✅ **Mejor manejo de errores**
- ✅ **Endpoints optimizados**
- ✅ **Contexto pedagógico mejorado**

## 📡 Endpoints

- `POST /api/generate` - Generar contenido pedagógico
- `POST /api/chat` - Chat pedagógico
- `GET /health` - Estado del servicio
- `GET /` - Información del API

## 🧪 Probar localmente

```bash
# 1. Crear .env con tu API key
cp .env.example .env
# Editar .env con tu GEMINI_API_KEY

# 2. Instalar dependencias
npm install

# 3. Ejecutar
npm start
```