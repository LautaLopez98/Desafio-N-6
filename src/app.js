import express from 'express';
import {router as productsRoutes} from "./routes/ProductRoutes.js"
import {router as cartRoutes} from "./routes/CartRoutes.js"
import {router as vistasRoutes} from "./routes/vistas.router.js";
import {Server} from 'socket.io';
import {engine} from 'express-handlebars';
import __dirname from '../utils.js';
import path from "path";
import { errorHandler } from './middlewares/errorHandler.js';
import mongoose from 'mongoose';
import ProductManagerMONGO from './dao/productManagerMONGO.js';
import { messagesModel } from './dao/models/messagesModel.js';
import { productsModel } from './dao/models/productModel.js';

const publics = path.join(__dirname, "src","public");
const views = path.resolve(__dirname, "src","views")

const PORT = 8080
const app = express()


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(publics));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', views);


app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", vistasRoutes);
app.use(errorHandler)

let usuarios=[]

const serverHTTP = app.listen(PORT, ()=> console.log(`Server online en puerto ${PORT}`));
export const io = new Server(serverHTTP);

io.on('connection', async (socket) =>{
    const productos = await productsModel.find();
    socket.emit('products', productos);
    console.log("Cliente conectado");

    socket.on('addProduct', async (producto) =>{
        const newGame = await productsModel.create({...producto});
        if (newGame) {
            productos.push(newGame);
            console.log(newGame)
            socket.emit('products', productos);
        }
    })

    socket.on('deleteProduct', async (productId) =>{
        let deleteProduct = await productsModel.deleteOne(productId)
        if (deleteProduct){
            socket.emit('productDeleted', deleteProduct);
        } else {
            console.log('Producto no encontrado');
            socket.emit('deleteError', 'Producto no encontrado');
        }
    })
}),

//Socket del chat//
io.on('connection', (socket) =>{
    socket.on("id", async(nombre)=>{
        usuarios.push({id:socket.id, nombre})
        let mensajes=await messagesModel.find().lean()
        mensajes=mensajes.map(m=>{
            return {nombre: m.email, mensaje: m.mensaje}
        })
        socket.emit("mensajesPrevios", mensajes)
        socket.broadcast.emit("nuevoUsuario", nombre)
    })

    socket.on("mensaje", async(nombre, mensaje)=>{
        await messagesModel.create({email:nombre, mensaje})
        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", ()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            io.emit("saleUsuario", usuario.nombre)
        }
    })
})

const db = async() => {
    try {
        await mongoose.connect(
            "mongodb+srv://Lautalopez:coderbackend@cluster0.w9exgg1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {dbName: "Ecommerce"} )
        console.log("db online")
    } catch (error) {
        console.log("Error al conectar a la base de datos", error.message);
    }
}

db()