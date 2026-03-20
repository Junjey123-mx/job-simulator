````markdown
# Job Simulator — REST CRUD API

API REST CRUD desarrollada en **Node.js + ExpressJS + PostgreSQL + Docker** para cumplir el laboratorio **Job Simulator** a nivel **Senior**.

El frontend provisto por el laboratorio consume el recurso `products`, por lo que la API mantiene esa ruta para asegurar compatibilidad. A nivel temático, cada registro representa un elemento del universo **rock / Linkin Park** como canciones, tracks o registros musicales, pero respetando exactamente el contrato del README original del laboratorio.

---

## Nivel entregado

**Nivel 3 — Senior (100/100)**

Incluye:

- PostgreSQL
- `docker-compose.yml` con dos servicios (`app` y `db`)
- variables de entorno con `.env` y `.env.example`
- endpoint `PATCH` para actualizaciones parciales
- `.gitignore` correcto
- script SQL de inicialización automática
- separación clara de responsabilidades
- historial de commits incremental

---

## Stack

- **Backend:** JavaScript + Node.js + ExpressJS
- **Base de datos:** PostgreSQL
- **Infraestructura:** Docker + Docker Compose
- **Variables de entorno:** dotenv

---

## Estructura del proyecto

```text
.
├── backend
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       ├── app.js
│       ├── db.js
│       ├── init.sql
│       ├── controllers
│       │   └── productsController.js
│       ├── routes
│       │   └── products.js
│       └── utils
│           └── validators.js
├── docker-compose.yml
├── .env.example
├── .gitignore
├── frontend
│   ├── Dockerfile
│   ├── docker-compose.yml.example
│   ├── nginx.conf
│   └── public
└── README.md
````

---

## Recurso expuesto

La API expone el recurso:

```text
/products
```

El contrato del laboratorio exige exactamente estos campos:

| Campo  | Tipo    | Restricciones              |
| ------ | ------- | -------------------------- |
| id     | integer | primary key, autoincrement |
| campo1 | string  | requerido                  |
| campo2 | string  | requerido                  |
| campo3 | string  | requerido                  |
| campo4 | integer | requerido                  |
| campo5 | float   | requerido                  |
| campo6 | boolean | requerido                  |

### Interpretación temática sugerida

Aunque la API debe respetar esos nombres fijos por contrato, semánticamente puede leerse así:

* `campo1`: título de la canción
* `campo2`: artista o banda
* `campo3`: álbum
* `campo4`: año
* `campo5`: duración
* `campo6`: disponible / favorita / activa

Ejemplo temático:

```json
{
  "campo1": "Numb",
  "campo2": "Linkin Park",
  "campo3": "Meteora",
  "campo4": 2003,
  "campo5": 3.07,
  "campo6": true
}
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con base en `.env.example`.

### Ejemplo

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=jobsimulator
DB_USER=postgres
DB_PASSWORD=postgres
APP_PORT=8080
```

---

## Ejecución con Docker

### Levantar todo

```bash
docker compose up -d --build
```

### Ver estado de los contenedores

```bash
docker compose ps
```

### Ver logs

```bash
docker compose logs app --tail=100
docker compose logs db --tail=100
```

### Detener servicios

```bash
docker compose down
```

### Reiniciar eliminando volumen de base de datos

```bash
docker compose down -v
```

---

## Cómo probar la API

La API queda disponible en:

```text
http://localhost:8080
```

---

## Endpoints implementados

### GET all

```http
GET /products
```

### GET by id

```http
GET /products/:id
```

### POST

```http
POST /products
```

### PUT

```http
PUT /products/:id
```

### DELETE

```http
DELETE /products/:id
```

### PATCH

```http
PATCH /products/:id
```

---

## Ejemplos de uso con curl

### Listar registros

```bash
curl -i http://localhost:8080/products
```

### Crear registro

```bash
curl -i -X POST http://localhost:8080/products \
  -H "Content-Type: application/json" \
  -d '{
    "campo1":"Numb",
    "campo2":"Linkin Park",
    "campo3":"Meteora",
    "campo4":2003,
    "campo5":3.07,
    "campo6":true
  }'
```

### Obtener por id

```bash
curl -i http://localhost:8080/products/1
```

### Reemplazo completo

```bash
curl -i -X PUT http://localhost:8080/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "campo1":"In the End",
    "campo2":"Linkin Park",
    "campo3":"Hybrid Theory",
    "campo4":2000,
    "campo5":3.36,
    "campo6":true
  }'
```

### Actualización parcial

```bash
curl -i -X PATCH http://localhost:8080/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "campo2":"Linkin Park Updated",
    "campo6":false
  }'
```

### Eliminar

```bash
curl -i -X DELETE http://localhost:8080/products/1
```

---

## Validaciones implementadas

Para `POST` y `PUT`:

* todos los campos son requeridos
* `campo1`, `campo2`, `campo3` deben ser strings no vacíos
* `campo4` debe ser integer
* `campo5` debe ser number válido
* `campo6` debe ser boolean

Para `PATCH`:

* solo se validan los campos presentes
* el resto del recurso no se modifica

---

## Códigos HTTP manejados

* `200 OK`
* `201 Created`
* `400 Bad Request`
* `404 Not Found`
* `500 Internal Server Error`

Todas las respuestas son JSON.

---

## Inicialización automática del esquema

El archivo:

```text
backend/src/init.sql
```

se ejecuta automáticamente al primer arranque del contenedor PostgreSQL mediante:

```text
/docker-entrypoint-initdb.d/init.sql
```

Además, la aplicación valida conexión e inicializa el esquema al arrancar.

---

## Integración con el frontend

El frontend del laboratorio espera esta configuración en:

```text
frontend/public/js/config.js
```

```js
window.API_URL = "http://localhost:8080";
window.RESOURCE = "products";
```

Esta implementación respeta exactamente ese contrato.

### Probar frontend manualmente

Si deseas probar el frontend por separado:

```bash
docker build -t job-simulator-frontend ./frontend
docker run -d --name job-simulator-frontend -p 8088:80 job-simulator-frontend
```

Luego abre:

```text
http://localhost:8088/index.html
```

---

## Scripts del backend

Desde `backend/`:

### Ejecutar en modo normal

```bash
npm start
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

---

## Notas de cumplimiento

Esta solución cumple con los requisitos Senior del laboratorio:

* PostgreSQL real, sin almacenamiento en memoria
* Docker obligatorio
* `docker-compose.yml` funcional
* PATCH parcial implementado
* `.env.example` incluido
* `.gitignore` correcto
* script SQL de inicialización
* separación clara entre:

  * entrada (`app.js`)
  * base de datos (`db.js`)
  * rutas (`routes/products.js`)
  * controladores (`controllers/productsController.js`)
  * validaciones (`utils/validators.js`)

---

## Autor

Proyecto desarrollado para el laboratorio **Job Simulator — REST CRUD API**.

```
```
