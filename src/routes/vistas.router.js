import { Router } from "express";
import ProductManagerMONGO from "../dao/productManagerMONGO.js";
import CartManagerMONGO from "../dao/cartManagerMONGO.js";
import { productsModel } from "../dao/models/productModel.js";
import { cartModel } from "../dao/models/cartModel.js";
export const router = Router();
const productManager = new ProductManagerMONGO()
const cartManager = new CartManagerMONGO()

router.get('/', async (req, res) =>{
    const productos = await productsModel.find().lean();
    return res.render('home', {productos});
})

router.get('/realtimeproducts', (req, res) =>{
    return res.render('realTimeProducts');
})

router.get('/chats',(req,res)=>{
    return res.status(200).render('chat')
})

router.get('/products', async (req, res) => {
    try {
        const { page, limit, sort, category, availability } = req.query;
        const pageNumber = parseInt(page) || 1;
        const result = await productManager.getProducts(
            parseInt(limit) || 10, 
            pageNumber,
            sort,
            { category, availability }
        );
        res.render("products", {
            productos: result.payload,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.get("/:cid", async(req, res)=>{
    let {cid}=req.params
    let cart=await cartManager.getCartById({_id:cid})

    res.setHeader('Content-Type','text/html');
    return res.status(200).render("carts", cart);
})