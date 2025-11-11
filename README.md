# ☠️ One Piece Explorer — App móvil con Firebase y Axios

## 🧭 Descripción general
**One Piece Explorer** es una aplicación móvil construida con **React Native** y **Expo**, diseñada como una experiencia interactiva para los fanáticos del universo *One Piece* en **YouTube**.  
Permite explorar personajes, tripulaciones y frutas del diablo del anime, ofreciendo una interfaz moderna, rápida y segura.

La app utiliza **Firebase** para autenticación y almacenamiento en la nube, y **Axios** para el consumo de servicios externos, garantizando datos actualizados y un rendimiento óptimo.  
Está estructurada bajo los principios de **Clean Architecture**, con capas separadas de dominio, datos y presentación, logrando una base sólida y mantenible.

---

## ⚙️ Tecnologías principales
- ⚛️ **React Native** (con Expo SDK 54)
- 🔥 **Firebase Authentication & Firestore**
- 🌐 **Axios** para consumo de API
- 📱 **Expo Router** para navegación basada en archivos
- 💡 **TypeScript** para tipado estático y mantenibilidad
- 🧩 **Context API + Hooks personalizados** para gestión de estado
- 🧱 **Arquitectura limpia (Clean Architecture)**

---

## 🚀 Instalación y ejecución
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el proyecto en modo desarrollo
npx expo start
```

Puedes ejecutar la app en:
- Dispositivo físico mediante **Expo Go**
- Emulador de Android o iOS
- Web (modo experimental)

---

## 🔐 Funcionalidades principales
- Registro, inicio de sesión y restablecimiento de contraseña con **Firebase Auth**
- Exploración de **personajes** con imágenes dinámicas
- Visualización de **frutas del diablo** con filtros y búsqueda avanzada
- Edición de perfil de usuario
- Sincronización de datos en tiempo real

---

## 🧰 Estructura del proyecto
El proyecto está organizado en capas siguiendo el patrón **Clean Architecture**:

```
src/
 ├── data/         # Conexión con APIs, Firebase y repositorios
 ├── domain/       # Entidades, repositorios e interfaces de negocio
 ├── presentation/ # Hooks, contextos y componentes visuales
 └── di/           # Contenedor de dependencias
```

---

## 🌍 Repositorio
🔗 [jmvillanueva-dev-mobilapp-one-piece-app](https://github.com/jmvillanueva-dev-mobilapp-one-piece-app)

---

## 🏷️ Labels
`#ReactNative` `#Expo` `#Firebase` `#Axios` `#CleanArchitecture` `#YouTubeApp` `#MobileApp` `#TypeScript`
