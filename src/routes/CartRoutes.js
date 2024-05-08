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

//funciona//
router.delete("/:cid/product/:pid", async (req, res) => {
    let { cid, pid } = req.params;
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error: `Enter a valid MongoDB id`,});
    }
    if (!cid || !pid) {
        return res.status(300).json({ error: "Check unfilled fields" });
    }
    try {
        await cartManager.deleteProduct(cid, pid);
        return res.json({ payload: `Product ${pid} deleted from cart ${cid}` });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

//no funciona//
router.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: "Invalid cart ID" });
    }

    try {
        const updatedCart = await cartManager.updateProductQuantity(cid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//no funciona//
router.put("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return res.status(400).json({ error: "Invalid cart or product ID" });
    }

    try {
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart);
        console.log(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//funciona//
router.delete("/:cid", async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error: `Enter a valid MongoDB id`});
    }
    try {
    let cart = await cartManager.deleteCart(cid);
        if (cart.deletedCount > 0) {
        return res.json({ payload: `Carrito con ${cid} eliminado` });
        } else {
        return res.status(404).json({ error: `El carrito con ${cid} no existe` });
        }
    } catch (error) {
        res.status(300).json({ error: `Error al eliminar el carrito con id ${cid}` });
        console.log(error);
    }
})
