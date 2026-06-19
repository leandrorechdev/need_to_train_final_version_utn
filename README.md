# 🏋️‍♂️ Need to Train

**Need to Train** es una aplicación móvil desarrollada con **React Native** y **Expo**, diseñada para la planificación integral de rutinas de entrenamiento físico. Permite a los usuarios organizar su semana, gestionar diferentes tipos de ejercicios (Gimnasio, Running, YouTube) y persistir sus datos de forma segura en la nube.

## 🚀 Características Clave

- **Planificación Semanal:** Interfaz intuitiva basada en días de la semana para organizar tu progreso.
- **Gestión Multimodal:**
  - **Gym:** Formulario específico para registrar series y repeticiones.
  - **Runner:** Registro de distancia y duración de carrera.
  - **YouTube:** Integración con videos de entrenamiento mediante búsqueda personalizada.
- **Experiencia Dinámica:**
  - **Multilenguaje:** Soporte completo para Inglés y Español con cambio en tiempo real.
  - **Modo Visual:** Soporte nativo para modo oscuro/claro persistido en el dispositivo.
  - **UI Fluida:** Navegación optimizada mediante *Tabs*, *Drawer* y *Modales flotantes*.
- **Backend:** Sincronización en tiempo real con **Firebase Firestore**.

## 📂 Estructura del Proyecto

La arquitectura sigue el estándar de `expo-router` con una separación clara entre lógica, componentes y constantes.

```text

src/
├── app/                     # Rutas y vistas principales
│   ├── (drawer)/            # Layout con menú lateral
│   ├── (tabs)/              # Navegación inferior (Home, Calendario)
│   │   ├── calendar/        # Lógica de gestión de entrenamiento
│   │   │   ├── _layout.tsx
│   │   │   ├── gym.tsx
│   │   │   ├── index.tsx
│   │   │   ├── runner.tsx
│   │   │   └── youtube.tsx
│   │   ├── _layout.tsx
│   │   └── index.tsx        # Pantalla de Bienvenida y acceso al plan
│   ├── _layout.tsx
│   ├── profile.tsx          # Configuración de usuario
│   ├── _layout.tsx
│   ├── login.tsx            # Pantalla de autenticación
│   └── register.tsx         # Pantalla de registro
├── components/              # Componentes UI reutilizables
│   ├── forms/               # Formularios especializados (Gym, Runner, YT)
│   │   ├── GymForm.tsx
│   │   ├── RunnerForm.tsx
│   │   └── YouTubeForm.tsx
│   ├── modals/
│   │   ├── CustomModal.tsx  # Selector modal flotante
│   │   └── index.ts
│   ├── AccessibilityHeader.tsx
│   ├── ExternalLink.tsx
│   ├── FormHeader.tsx
│   ├── FormWrapper.tsx
│   ├── LanguagePicker.tsx
│   ├── ScreenWrapper.tsx
│   ├── WorkoutCard.tsx
│   ├── WorkoutOptionsPanel.tsx
│   └── YoutubeBrowserModal.tsx
├── config/
│   └── firebase.ts           # Configuración de Firebase
├── constants/                # i18n, estilos globales, temas y videos
│   ├── i18n.ts
│   ├── styles.ts
│   ├── theme.ts
│   └── videos.ts
├── context/                  # Contextos globales (Language, Theme, Modal)
│   ├── LanguageContext.tsx
│   ├── ModalContext.tsx
│   └── ThemeContext.tsx
├── hooks/                    # Hooks personalizados (useAppTheme, useTranslation)
│   ├── useAppTheme.ts
│   └── useTranslation.ts
├── services/
├── utils/                    # Lógica de almacenamiento
│   ├── authErrors.ts
│   └── workoututils.ts

```

## ✨ Características Técnicas

- **Wrappers Inteligentes:** Centralización de KeyboardAvoidingView y SafeAreaInsets para garantizar que la UI se adapte perfectamente en cualquier dispositivo.

- **Inversión de Control:** Los formularios utilizan el patrón onSuccess, permitiendo al componente padre decidir el flujo de navegación post-acción.

- **Accesibilidad (A11y):** Implementación de etiquetas semánticas (accessibilityLabel, accessibilityRole, accessibilityState) en todos los campos interactivos.

- **Seguridad:** Gestión de credenciales mediante variables de entorno (.env) y buenas prácticas de autenticación.

## 📦 Tecnologías y Herramientas

El proyecto está construido sobre un stack moderno y escalable diseñado para dispositivos móviles(optimizado para Android, próximamente lanzaremos un diseño multiplataforma):

- **Core:** React Native con Expo para un desarrollo rápido y eficiente.
- **Enrutamiento:** `expo-router` basado en archivos, facilitando la navegación profunda y el manejo de layouts.
- **Base de Datos:** Firebase Firestore, permitiendo el almacenamiento de rutinas en la nube en tiempo real.
- **Autenticación:** Firebase Auth, gestionando el ciclo de vida de las sesiones de usuario (login, register, logout).
- **Internacionalización:** `i18n-js` junto con `expo-localization` para adaptar la interfaz dinámicamente.
- **Gestión de Estado:** Contextos de React para persistir preferencias de usuario localmente mediante AsyncStorage.

## ⚙️ Configuración del Entorno

**Clonar el repositorio:**

```bash
git clone https://github.com/leandrorechdev/need_to_train_final_version_utn.git
```

## 🚀 Instalación y Ejecución

**Instalar dependencias:**

```bash
npm install
```

**Firebase:**
Configura tu archivo en `src/config/firebase.ts` con tus credenciales de Firebase.

**Ejecución:**

```bash
npx expo start
```

## 🎨 Diseño Visual e Interfaz (UI/UX)

La aplicación sigue una línea estética marcada por el estilo **punk rock**, priorizando el alto contraste y la tipografía sólida.

- **Sistema de Temas:** Implementado a través de `ThemeContext`, permite cambiar instantáneamente entre modo claro y oscuro.
- **Paleta de Colores (`constants/theme.ts`):**
  - **Primarios:** `punkYellow` (`#E2B13C`) para llamadas a la acción.
  - **Secundarios:** `punkRed` (`#E63946`) para alertas y acciones destructivas.
- **Jerarquía:** Uso intensivo de `fontWeight: '900'` y `letterSpacing` para una sensación de robustez.

🚀 Próximos pasos

[ ] Ruitinas precargadas según objetivos y grupos musculares.

[ ] Implementación de Dashboard estadístico de progreso

[ ] Contador de pasos, cronómetro y demás mejoras para runners.

[ ] Mejoras en el perfil del usuario, implementación de subida de archivos

Desarrollado para quienes buscan eficiencia en su planificación de entrenamiento.
