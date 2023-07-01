const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp)
const expect = chai.expect
//importando app
const { app } = require('../index')

describe('API USERS', () => {
    describe('GET /', () => {
        it('Deberia retornarme un mensaje de bienvenida', (done) => {
            chai
                .request(app)
                .get('/')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.text).to.equal("Bienvenidos a nuestros test")
                    done();
                })
        });
    })
    describe('GET /usuarios', () => {
        it("Deberia devolverme un array con los usuarios", async () => {
            const res = await chai.request(app).get('/usuarios');
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('usuarios').that.is.a("array")
        })
        it("Deberia devolverme un usuario especifico", async () => {
            const resUsuarios = await chai.request(app).get('/usuarios');
            const idUsuario = resUsuarios.body.usuarios[0].id
            const res = await chai.request(app).get(`/usuarios/${idUsuario}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.a("object")
            expect(res.body).to.have.property('id').equal(idUsuario)
        })
        it("Deberia retornarme que el usuario no existe con un codigo de error", async () => {
            const res = await chai.request(app).get(`/usuarios/id_falso`)
            expect(res).to.have.status(404)
            expect(res.text).to.be.equal("Usuario no existe")
        })
    })
    describe("POST /usuarios", () => {
        it("Deberia crear un usuario", async () => {
            const usuario = { nombre: "Jhosiany", apellido: "Ramirez" };
            const res = await chai.request(app).post("/usuarios").send(usuario);
            expect(res).to.have.status(201);
            expect(res.text).to.equal("Usuario Creado con exito");
        });
        it("Deberia devolverme un mensaje de error si no se pudo crear el usuarios", async () => {
            const usuario = { nombre: "Sebastian" };
            const res = await chai.request(app).post("/usuarios").send(usuario);
            expect(res).to.have.status(400);
            expect(res.text).to.equal("Datos incompletos");
        });
    });

    describe("PUT /usuarios", () => {
        it("Deberia actualizar un usuario", async () => {
            const resUsuarios = await chai.request(app).get("/usuarios");
            const idUsuario = resUsuarios.body.usuarios[3].id;
            const usuario = { nombre: "Actualizo", apellido: "Actualizado" };
            const res = await chai
                .request(app)
                .put(`/usuarios/${idUsuario}`)
                .send(usuario);
            expect(res).to.have.status(200);
            expect(res.text).to.equal("Usuario actualizado correctamente");
        });
    });

    describe("DELETE /usuarios", () => {
        it("Deberia eliminar un usuario que si exista", async () => {
            //Aca se buscan todos los usuarios pero solo elije el primer usuario
            const resUsuarios = await chai.request(app).get("/usuarios");
            const idUsuario = resUsuarios.body.usuarios[0].id;

            const res = await chai.request(app).delete(`/usuarios/${idUsuario}`);
            expect(res).to.have.status(200);
            expect(res.text).to.equal("Usuario eliminado con éxito");
        });
        it("No deberia eliminar si el usuario no existe", async () => {
            const res = await chai.request(app).delete(`/usuarios/idFalso`);
            expect(res).to.have.status(404);
            expect(res.text).to.equal("Usuario no existe");
        })
    });
})

