from locust import TaskSet, HttpLocust, task


class StoreBehavior(TaskSet):
    @task(6)
    def get_providers(self):
        self.client.get("/api/providers")

    @task(6)
    def get_orders(self):
        self.client.get("/api/orders")





class Test_Store(HttpLocust):
    task_set = StoreBehavior
    min_wait = 3000
    max_wait = 4000
