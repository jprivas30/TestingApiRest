
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const { v4: uuidv4 } = require("uuid")

//permiten manejar peticiones en mi body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).send('Bienvenidos a nuestros test');
});

app.get('/usuarios', (req, res) => {
    let data = fs.readFileSync('usuarios.json', 'utf-8')
    let { usuarios } = JSON.parse(data)
    res.status(200).json({ usuarios })
})

app.get('/usuarios/:id', (req, res) => {
    try {
        const { id } = req.params;
        let data = fs.readFileSync('usuarios.json', 'utf-8')
        let { usuarios } = JSON.parse(data)
        let usuario = usuarios.find(item => item.id == id)
        if (usuario === undefined) {
            throw new Error('Usuario no existe')
        }
        res.status(200).send(usuario)
    } catch (error) {
        //console.log(error.message)
        res.status(404).send(error.message)
    }
})

app.post("/usuarios", (req, res) => {
    try {
        const { nombre, apellido } = req.body;
        if (nombre == undefined || apellido == undefined) {
            throw new Error("Datos incompletos");
        }
        let data = fs.readFileSync("usuarios.json", "utf-8");
        let { usuarios } = JSON.parse(data);
        usuarios.push({ id: uuidv4().slice(30), nombre: nombre, apellido: apellido })
        fs.writeFileSync("usuarios.json", JSON.stringify({ usuarios }))
        res.status(201).send("Usuario Creado con exito")
    } catch (error) {
        res.status(400).send(error.message)
    }
});

app.put('/usuarios/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido } = req.body;
        if (nombre === undefined || apellido === undefined) {
            throw new Error('Datos incompletos');
        }
        let data = fs.readFileSync('usuarios.json', 'utf-8');
        let { usuarios } = JSON.parse(data);
        let usuario = usuarios.find(item => item.id == id);
        if (usuario === undefined) {
            throw new Error('Usuario no existe');
        }
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        fs.writeFileSync('usuarios.json', JSON.stringify({ usuarios }));
        res.status(200).send('Usuario actualizado correctamente');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete("/usuarios/:id", (req, res) => {
    try {
        const { id } = req.params;
        let data = fs.readFileSync("usuarios.json", "utf-8");
        let { usuarios } = JSON.parse(data);
        let usuario = usuarios.find((item) => item.id == id);
        if (usuario === undefined) {
            throw new Error("Usuario no existe");
        }
        usuarios = usuarios.filter(item => item.id != id)
        fs.writeFileSync("usuarios.json", JSON.stringify({ usuarios }))
        res.status(200).send("Usuario eliminado con éxito")
    } catch (error) {
        res.status(404).send(error.message)
    }
})

app.listen(port, () => console.log(`Escuchando nuestro puesto ${port}!`))
//exportando app 
module.exports = { app }

