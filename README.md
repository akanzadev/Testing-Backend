# LA SED NOCTURNA

1. Instalación de dependencias

```javascript
npm install
```


#

    "test": "cross-env NODE_ENV=development jest --coverage --passWithNoTests",
    "test:unit": "cross-env NODE_ENV=development jest test/unit/**/* --coverage --passWithNoTests",
    "test:coverage": "cross-env NODE_ENV=development jest --coverage",
    "test:coverage:unit": "npm run test:unit -- --coverage"