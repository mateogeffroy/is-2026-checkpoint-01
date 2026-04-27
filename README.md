# TeamBoard App - Checkpoint 01

TeamBoard es una aplicación web funcional que muestra los integrantes del equipo, la feature que implementó cada uno y el estado de su servicio. Todo corre orquestado por Docker Compose.

## Equipo e Integrantes

| Nombre y Apellido | Legajo | Feature Asignada | Rol |
| :--- | :--- | :--- | :--- |
| Mateo Arturo Geffroy | 32.027 | Feature 01 y 04 | Coordinador e Infraestructura Base y Base de Datos |
| Luciana Martino | 30.499 | Feature 02 | Frontend |
| German Altamirano | 31.044 | Feature 03 | Backend |
| Benjamin Briones | 32.101 | Feature 05 | Portainer |

## Instrucciones de Ejecución

1. Clonar el repositorio:
   `git clone https://github.com/mateogeffroy/is-2026-checkpoint-01.git`
2. Configurar variables de entorno:
   Copiar el archivo `.env.example` y renombrarlo a `.env`. Completar las credenciales requeridas.
3. Levantar la infraestructura:
   Ejecutar `docker compose up -d --build` en la raíz del proyecto.
4. Acceder a los servicios:
   * **Frontend:** http://localhost:8080
   * **Backend API:** http://localhost:5000/api/health
   * **Portainer:** http://localhost:9000

## Descripción de Servicios
* **Frontend:** Página HTML servida por un servidor HTTP de Python.
* **Backend:** API REST con Python y Flask que se conecta a la base de datos.
* **Database:** Base de datos PostgreSQL 16.
* **Portainer:** Panel de monitoreo para los contenedores Docker.

---

## Feature 01 — Coordinación, Infraestructura Base y README

Se implementó la infraestructura completa del proyecto: la creación del repositorio en GitHub, la configuración del flujo de trabajo colaborativo con protección de ramas, y el archivo `docker-compose.yml` que orquesta los cuatro servicios de la aplicación.

### Responsabilidades del Coordinador

* Creación del repositorio público en GitHub con el nombre exacto `is-2026-checkpoint-01`.
* Configuración de **branch protection** en `main`: ningún integrante puede hacer push directo. Todo cambio ingresa mediante Pull Request revisado y aprobado.
* Invitación de todos los integrantes como colaboradores del repositorio.
* Creación de la estructura de carpetas inicial y el `.gitignore` base.
* Provisión del archivo `.env.example` con todas las variables de entorno necesarias para que cada integrante pueda configurar su entorno local.
* Revisión, coordinación y merge de los Pull Requests de cada feature.
* Verificación final de que `docker compose up` levanta todos los servicios sin errores.

### Archivos Principales

#### `docker-compose.yml`

Es el corazón de la infraestructura. Define, conecta y limita los cuatro servicios de la aplicación:

* **`frontend`** — Se construye desde `./frontend` (Feature 02). Expone el puerto `8080` hacia el host. Depende del servicio `backend` para arrancar después de él.
* **`backend`** — Se construye desde `./backend` (Feature 03). Expone el puerto `5000`. Lee sus credenciales de base de datos desde el archivo `.env` mediante `env_file`. Depende del HEALTHCHECK de `database` para arrancar después de él.
* **`database`** — Servicio PostgreSQL (Feature 04). No tiene puerto público expuesto al host: solo es accesible internamente a través de la red `teamboard_net`. Su configuración de imagen, variables de entorno, volumen persistente y healthcheck es responsabilidad de Feature 04.
* **`portainer`** — Panel de monitoreo Docker (Feature 05). Su imagen, puerto `9000` y volúmenes son configurados por Feature 05.

#### Red interna

Todos los servicios comparten la red `teamboard_net` de tipo `bridge`. Esto permite que se comuniquen entre sí por nombre de contenedor (por ejemplo, el backend se conecta a `database` como host) sin exponer puertos innecesarios al exterior.

#### Límites de recursos

Cada servicio tiene configurados límites explícitos de CPU y memoria en la sección `deploy.resources` para evitar que un contenedor consuma recursos excesivos del host:

| Servicio   | CPU       | Memoria |
| :--------- | :-------- | :------ |
| frontend   | 0.5 cores | 256 MB  |
| backend    | 0.5 cores | 256 MB  |
| database   | 1.0 core  | 512 MB  |
| portainer  | 0.5 cores | 256 MB  |

#### `.env` y `.env.example`

Las credenciales de la base de datos (usuario, contraseña, nombre de base de datos, host y puerto) se definen en el archivo `.env`, que **no se sube al repositorio** (está en `.gitignore`). El archivo `.env.example` actúa como plantilla con las claves necesarias pero sin valores reales, de modo que cualquier integrante pueda configurar su entorno local copiándolo y completándolo.

#### `.gitignore`

Excluye del repositorio todos los archivos que no deben versionarse, incluyendo `.env` (credenciales), `__pycache__` (bytecode de Python) y archivos de configuración local de editores e IDEs.

### Dependencias entre Features

El `docker-compose.yml` refleja el orden de arranque y las dependencias funcionales de la aplicación:

* **Feature 04** (Database) debe estar lista antes de que el Backend pueda leer datos.
* **Feature 03** (Backend) debe estar activo antes de que el Frontend intente consultar la API.
* **Feature 02** (Frontend) depende de `backend` mediante `depends_on`.
* **Feature 05** (Portainer) opera de forma independiente y monitorea todos los contenedores.