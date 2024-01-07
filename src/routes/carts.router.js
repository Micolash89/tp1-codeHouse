import { Router } from 'express';
import File from '../File.js';

const cartsRouter = Router();

const PATH = "carrito.json";
const PATHPRODUCT = "productos.json";

const cf = new File(PATH);
const pf = new File(PATHPRODUCT);

cartsRouter.get('/:cid', async (req, res) => {

    if (!cf.exist()) {
        return res.status(400).send({ status: "error", error: "No hay archivo de carrito" })
    } else {
        const respuesta = await cf.getFile();
        const cid = req.params.cid;

        const carrito = respuesta.find(e => e.id == cid);

        (carrito) ? res.send(carrito) : res.status(400).send({ status: "error", error: `no existe el carrito con el id ${cid}` })

    }


})

cartsRouter.post('/', async (req, res) => {

    if (!cf.exist()) {
        await cf.setFile([{ id: 1, productos: [] }])
    } else {
        const respuesta = await cf.getFile();
        let id = respuesta[respuesta.length - 1].id + 1
        respuesta.push({ id, productos: `${[]}` })
        await cf.setFile(respuesta)
    }

    res.send({ status: "Hecho", message: "Carrito creado" })



})


cartsRouter.post('/:cid/product/:pid', async (req, res) => {

    //buscar con el carrito cid y agregar un producto si ya existe sumarle uno al quality++
    if (!cf.exist()) {
        return res.status(400).send({ status: "error", error: "No hay archivo de carrito" });
    } else {
        let cid = req.params.cid;
        let pid = req.params.pid;


        if (! await pf.findFile(pid)) {
            return res.status(400).send({ status: "error", error: `el producto con el id: ${pid} no existe` })
        }

        if (! await cf.findFile(cid)) {
            return res.status(400).send({ status: "error", error: `el carrito con el id: ${pid} no existe` })
        }

        const respuesta = await cf.getFile();

        const carrito = respuesta.find(e => e.id == cid);

        const producto = respuesta.find(e => e.id == cid).productos.find(e => e.id == pid);

        if (producto) {
            // ++respuesta.productos[carrito.indexOf(producto)].quality;
            ++respuesta.find(e => e.id == cid).productos.find(e => e.id == pid).quality
        } else {
            carrito.productos.push({ id: pid, quality: 1 });
        }

        cf.setFile(respuesta);

    }
    res.send({ status: "Hecho", message: "Carrito creado" })

})

export default cartsRouter;