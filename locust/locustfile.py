from locust import TaskSet, HttpLocust, task


class StoreBehavior(TaskSet):
    @task(10)
    def get_products(self):
        self.client.get("/api/products")

    @task(2)
    def get_categories(self):
        self.client.get("/api/categories")

    @task(1)
    def get_brands(self):
        self.client.get("/api/brands")
        
    @task(6)
    def get_brands(self):
        self.client.get("/api/providers")





class Test_Store(HttpLocust):
    task_set = StoreBehavior
    min_wait = 3000
    max_wait = 4000
