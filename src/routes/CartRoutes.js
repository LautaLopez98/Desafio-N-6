import {Router} from "express";
import CartManagerMONGO from "../dao/cartManagerMONGO.js";
import {isValidObjectId} from "mongoose";
export const router = Router();

const cartManager = new CartManagerMONGO()


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

router.post("/:cid/product/:pid", async (req, res) => {
        let { cid, pid } = req.params;
        if (!isValidObjectId(cid, pid)) {
        return res.status(400).json({error: `Enter a valid MongoDB id`});
        }
        try {
            await cartManager.addToCart(cid, pid);
            let cartUpdated = await cartManager.getCartById(cid);
            res.json({ payload: cartUpdated });
        } catch (error) {
            res.status(500).json({ error: error.message });}
});

// const { cid, pid } = req.params;
// try {
//     const cart = await cartManager.addProductToCart(cid, pid, quantity);
//     res.status(200).json(cart);
// } catch (error) {
//     res.status(500).json({ error: error.message });
// }
// });
