import {Router} from "express";
import ProductManagerMONGO from "../dao/productManagerMONGO.js";
export const router = Router();
import {io} from "../app.js"
import { upload } from "../../utils.js";
import {isValidObjectId} from "mongoose";


const productManager = new ProductManagerMONGO();


router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.json(products);
    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).json({error: error.message});
    }
});


router.get("/:pid", async (req, res)=> {
    let {pid}=req.params
    if(!isValidObjectId(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id valido de MongoDB como argumento para busqueda`})
    }
    try {
        let product = await productManager.getProductById({_id:pid});
        res.json(product);
    } catch (error) {
        console.error(`Error al obtener el producto con id ${id}`, error);
        res.status(500).json({error: error.message});
    }
})


router.post("/", upload.single("thumbnail"), async (req, res)=> {
    try {
        let {title, description, price, code, stock, category, status} = req.body;
        let thumbnail=undefined
        if(req.file){
            thumbnail=req.file
        }
        if(!title || !description || !price || !code || !stock || !category){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Faltan datos: title, description, price, code, stock, category son obligatorios`})
        }
        const product = await productManager.addProduct({title, description, price, thumbnail, code, stock, category, status})
        res.json(product)
    } catch (error) {
        console.error("Error al crear el producto", error);
        res.status(500).json({error: error.message});
    }
})


router.put("/:pid", async (req, res)=> {
    let {pid}=req.params
    if(!isValidObjectId(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id valido de MongoDB como argumento para busqueda`})
    }
    try{
    const newProduct = await productManager.updateProduct({_id:pid}, req.body)
    res.json(newProduct)
    }catch(error) {
        console.error(`Error al actualizar el producto con id ${pid}`, error);
        res.status(500).json({error: error.message});
    }
});


router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    if (!isValidObjectId(pid)) {
        return res.status(400).json({error: `Enter a valid MongoDB id`});
    }
    try {
        let products = await productManager.deleteProduct(pid);
        if (products.deletedCount > 0) {
        let productList = await productManager.getProducts();
        io.emit("deleteProducts", productList);
        return res.json({ payload: `Product ${pid} deleted` });
    } else {
        return res.status(404).json({ error: `Product ${id} doesnt exist` });
    }
    } catch (error) {
        res.status(300).json({ error: `Error deleting product ${pid}` });
    }
});
