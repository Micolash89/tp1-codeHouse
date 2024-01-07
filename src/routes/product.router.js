import { Router } from 'express';
import { uploader } from '../utils.js'
import File from '../File.js';


const productRouter = Router();
const PATH = "productos.json";

const pf = new File(PATH);

productRouter.get('/', async (req, res) => {

    let limit = req.query.limit;//limit con "?" en la direccion, podes armar querys    
    //ruta de ejemplo http://localhost:8080/api/products?limit=2

    if (!pf.exist()) {
        return res.status(400).send({ status: "error", error: "No hay productos" })
    } else {

        const respuesta = await pf.getFile()

        if (!limit || limit < 0) {
            return res.send(respuesta)
        } else {
            let variable = respuesta.slice(0, limit)
            res.send({ "status": "consulta satisfactoria", "productos": variable })
        }
    }
})

productRouter.get('/:pid', async (req, res) => {

    if (!pf.exist) {
        res.status(400).send({ status: "error", error: "No hay productos" })
    } else {
        const pid = req.params.pid;
        const respuesta = await pf.getFile();

        const product = respuesta.find((product) => product.id == pid);
        if (!product) return res.status(404).send("No, ese no lo traigo.");//que pasa sino existe el archivo
        return res.send(product);
    }
})

productRouter.post('/', uploader.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ status: "error", error: "No se pudo guardar la imagen" })
    }

    let product = req.body
    product.thumbnail = req.file.path;

    if (!pf.exist()) {
        product.id = 1;
        await pf.setFile([product])
    } else {
        const respuesta = await pf.getFile();
        product.id = respuesta[respuesta.length - 1].id + 1
        respuesta.push(product)
        await pf.setFile(respuesta)
    }

    res.send({ status: "Hecho", message: "Producto creado" })

})

productRouter.put('/:pid', uploader.single('file'), async (req, res) => {

    if (!pf.exist()) {
        return res.status(400).send({ status: "error", error: "No hay productos" })
    } else {
        const pid = req.params.pid;
        let product = req.body;
        if (req.file) {
            product.thumbnail = req.file.path;
        }

        const respuesta = await pf.getFile();
        let productViejo = respuesta.find(e => e.id == pid);

        if (!productViejo) {
            return res.status(400).send({ status: "error", error: `No existe ese producto con id : ${pid}` })
        }
        let productoNuevo = { ...productViejo, ...product }

        respuesta[respuesta.indexOf(productViejo)] = productoNuevo

        await pf.setFile(respuesta);

        res.send({ status: "Hecho", message: "Producto actualizado" })
    }

})

productRouter.delete('/:pid', async (req, res) => {

    if (!pf.exist()) {
        return res.status(400).send({ status: "error", error: "No hay productos" })
    } else {

        let pid = req.params.pid;
        const respuesta = await pf.getFile();

        let productEliminar = respuesta.find(e => e.id == pid);

        if (!productEliminar) {
            return res.status(400).send({ status: "error", error: `No existe ese producto con id : ${pid}` })
        }

        respuesta.splice(respuesta.indexOf(productEliminar), 1)
        await pf.setFile(respuesta);

        res.send({ status: "Hecho", message: "Producto Eliminado" })
    }

})

export default productRouter;