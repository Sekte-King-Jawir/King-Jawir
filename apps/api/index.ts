import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello from Elysia!")
  .listen(4102);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);