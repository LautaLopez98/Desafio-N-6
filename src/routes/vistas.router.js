import { Router } from "express";
import ProductManagerMONGO from "../dao/productManagerMONGO.js";
import { productsModel } from "../dao/models/productModel.js";
export const router = Router();
const productManager = new ProductManagerMONGO()

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