# Internacionalización (i18n) - Invoice App

Este proyecto utiliza `react-i18next` para manejar la internacionalización.

## Configuración

La configuración principal se encuentra en `src/i18n/index.ts`.

### Idiomas Soportados

- **Inglés (en)**: Idioma por defecto
- **Español (es)**: Idioma secundario

## Uso

### Hook Personalizado

Usa el hook `useTranslation` para acceder a las traducciones:

```tsx
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t, changeLanguage, currentLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('common.login')}</h1>
      <button onClick={() => changeLanguage('es')}>
        Cambiar a Español
      </button>
    </div>
  );
};
```

### Componente LanguageSwitcher

Incluye el componente `LanguageSwitcher` en tu aplicación para permitir a los usuarios cambiar el idioma:

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

const Header = () => {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
};
```

## Estructura de Traducciones

Las traducciones están organizadas en archivos JSON por idioma:

```
src/i18n/locales/
├── en.json (Inglés)
└── es.json (Español)
```

### Estructura de Claves

Las traducciones están organizadas en categorías:

- `common`: Textos comunes (botones, etiquetas, etc.)
- `auth`: Textos relacionados con autenticación
- `navigation`: Textos de navegación
- `invoice`: Textos relacionados con facturas

### Ejemplo de Uso

```tsx
// Traducción simple
t('common.login')

// Traducción con interpolación
t('welcome', { name: 'John' })

// Traducción con pluralización
t('items', { count: 5 })
```

## Agregar Nuevos Idiomas

1. Crea un nuevo archivo JSON en `src/i18n/locales/` (ej: `fr.json`)
2. Agrega el idioma a la configuración en `src/i18n/index.ts`
3. Actualiza el componente `LanguageSwitcher` para incluir el nuevo idioma

## Detección Automática

El sistema detecta automáticamente el idioma del navegador y lo guarda en localStorage para futuras visitas.

## Debug

En modo desarrollo, puedes ver información de debug en la consola del navegador para ayudar con la configuración de traducciones. 