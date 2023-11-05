const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafés", () => {

    it("Debería retornar un código 200 y un arreglo no vacío al solicitar todos los cafés", async () => {
        const { statusCode, body } = await request(server).get("/cafes").send();
        expect(statusCode).toBe(200);
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThanOrEqual(1);
    });

    it("Debería devolver un código 404 al intentar eliminar un café con un ID inexistente", async () => {
        const jwt = "token";
        const idCafe = 123456789;
        const { statusCode, body } = await request(server)
            .delete(`/cafes/${idCafe}`)
            .set("Authorization", jwt)
            .send();
        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: 'No se encontró ningún cafe con ese id' });
    });

    it("Debería devolver un código 201 y agregar un nuevo café al hacer POST en /cafes", async () => {
        const id = Math.floor(Math.random() * 999);
        const cafe = { id, nombre: "Nuevo Café" };
        const { statusCode, body } = await request(server)
            .post("/cafes")
            .send(cafe);
        expect(statusCode).toBe(201);
        expect(body).toEqual(expect.arrayContaining([cafe]));
    });

    it("Debería devolver un código 400 al intentar actualizar un café con un ID en la ruta no coincidente con el ID del cuerpo", async () => {
        const idNoValido = 1313;
        const cafe = { id: 1212, nombre: "frappuccino" };
        const { statusCode, body } = await request(server)
            .put(`/cafes/${idNoValido}`)
            .send(cafe);
        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: 'El id del parámetro no coincide con el id del café recibido' });
    });
});
