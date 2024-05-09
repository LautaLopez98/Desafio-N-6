import {Router} from "express";
import CartManagerMONGO from "../dao/cartManagerMONGO.js";
import ProductManagerMONGO from "../dao/productManagerMONGO.js";
import {isValidObjectId} from "mongoose";
export const router = Router();

const cartManager = new CartManagerMONGO()
const productManager = new ProductManagerMONGO()

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts(); 
        res.json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos", error);
        res.status(500).json({error: error.message});
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.json({newCart});
    } catch (error) {
        console.error("Error al crear el cart", error);
        res.status(500).json({error: error.message});
    }
})

router.get("/:cid", async (req, res) => {
    let {cid}=req.params
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id valido de MongoDB como argumento para busqueda`})
    }
    try {
        const cart = await cartManager.getCartById({_id:cid});
        res.json(cart);
    
    } catch (error) {
        console.error("Error al obtener el cart", error);
        res.status(500).json({error: error.message});
    }
})

router.post('/:cid/product/:pid',async(req,res)=>{
    let {cid, pid}=req.params
    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese cid / pid válidos`})
    }

    let carrito=await cartManager.getCartById({_id:cid})
    if(!carrito){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Carrito inexistente: id ${cid}`})
    }

    let producto=await productManager.getProductById({_id:pid})
    if(!producto){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`No existe producto con id ${pid}`})
    }
    let indiceProducto=carrito.products.findIndex(p=>p.product==pid)
    if(indiceProducto===-1){
        carrito.products.push({
            product: pid, quantity:1
        })
    }else{
        carrito.products[indiceProducto].quantity++
    }

    let resultado=await cartManager.update(cid, carrito)
    if(resultado.modifiedCount>0){
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Carrito actualizado", carrito });
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`No se pudo realizar la actualizacion`
            }
        )
        
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const result = await cartManager.deleteProductInCart(cid, pid);
        res.json({ message: "Producto eliminado del carrito", result });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: error.message });
    }
});


router.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const result = await cartManager.update(cid, { products });
        res.json({ message: "Carrito actualizado", result });
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: error.message });
    }
});


router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const result = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ message: "Cantidad de producto actualizada en el carrito", result });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
        res.status(500).json({ error: error.message });
    }
});


router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartManager.deleteProducts(cid);
        res.json({ message: "Todos los productos eliminados del carrito", result });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).json({ error: error.message });
    }
});
