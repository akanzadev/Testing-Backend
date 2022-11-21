# Running Locust

Primero hay que descargar ngrok, que es una herramienta que nos permite exponer nuestro localhost a internet. Para descargarlo, hay que ir a la página de [ngrok](https://ngrok.com/download) y descargar el archivo correspondiente a nuestro sistema operativo. Una vez descargado, hay que descomprimirlo y moverlo a la carpeta de nuestro proyecto.

Una vez hecho esto, hay que abrir una terminal en la carpeta de nuestro proyecto y ejecutar el siguiente comando:

```bash
./ngrok http 8080
```

De esta manera estamos exponiendo el puerto 8080 de nuestro localhost a internet.

Luego debemos empezar con la creación de nuestro archivo de locust. Para esto, hay que crear un archivo llamado `locustfile.py` en la carpeta raíz de nuestro proyecto o en una subcarpeta. En este archivo, vamos a definir las tareas que va a realizar locust. Para esto, vamos a importar la librería `locust` y vamos a crear una clase que herede de `HttpLocust`. Esta clase va a tener dos atributos: `task_set` y `min_wait` y `max_wait`. El atributo `task_set` va a ser una lista de funciones que van a ser las tareas que va a realizar locust. El atributo `min_wait` y `max_wait` van a ser los tiempos mínimos y máximos que va a esperar locust entre cada tarea.

```python
from locust import TaskSet, HttpLocust, task
import random


class OwnerBehavior_OwnerA(TaskSet):

    @task(10)
    def get_owner(self):
        self.client.get("/propietarios")

    @task(2)
    def get_owner_by_id(self):
        self.client.get("/propietarios/1")

    @task(1)
    def post_owner(self):
        index = random.randint(0, 1000)
        self.client.post("/propietarios", json={
            "emailPropietario": "test" + str(index) + "@gmail.com",
            "namePropietario": "test" + str(index),
        })


class OwnerBehavior_OwnerB(TaskSet):

    @ task(4)
    def get_owner(self):
        self.client.get("/propietarios")

    @ task(2)
    def get_owner_by_id(self):
        self.client.get("/propietarios/2")

    @task(1)
    def post_owner(self):
        index = random.randint(0, 1000)
        self.client.post("/propietarios", json={
            "emailPropietario": "test" + str(index) + "@gmail.com",
            "namePropietario": "test" + str(index),
        })


class Test_OwnerA(HttpLocust):
    task_set = OwnerBehavior_OwnerA
    min_wait = 2000
    max_wait = 5000


class Test_OwnerB(HttpLocust):
    task_set = OwnerBehavior_OwnerB
    min_wait = 3000
    max_wait = 4000
```

Ahora debemos crear el Dockerfile para nuestro archivo de locust

```dockerfile
FROM christianbladescb/locustio
ADD  locust/locustfile.py locustfile.py
```

Y por último, debemos agregar a nuestro archivo `docker-compose.yml` los servicios para locust

```yaml
 locust-master:
    build:
      context: .
      dockerfile: locust/Dockerfile
    container_name: locust-master
    ports:
      - "8089:8089"
    command: "--host=https://e24d-179-6-160-198.ngrok.io --master"

  locust-slave:
    depends_on:
      - locust-master
    build:
      context: .
      dockerfile: locust/Dockerfile
    command: "--host=https://e24d-179-6-160-198.ngrok.io --master-host=locust-master --slave"
```

Ahora debemos ejecutar el siguiente comando para levantar los servicios de nuestro docker-compose

```bash
docker-compose up -d
```

En caso se haga un cambio en el archivo `locustfile.py`, hay que volver a construir la imagen de locust

```bash
docker-compose down
docker-compose build locust-master
docker-compose build locust-slave
docker-compose up -d
```

O tambien podemos ejecutar el siguiente comando para volver a construir todas las imágenes

```bash
docker-compose down
docker-compose up -d --build
```
