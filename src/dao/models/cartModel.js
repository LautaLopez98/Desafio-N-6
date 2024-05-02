import {Schema, mongoose, model} from "mongoose"

const cartCollection="Cart"
const cartEsquema=new mongoose.Schema({
    products:[
        {
            _id:false,
            id: {
                type:Schema.Types.ObjectId,
                ref: "productos"
            },
            quantity:{
                type: Number,
                required: true,
            },
        },
        {
            timestamps: true,
        }
    ]
})

export const cartModel=mongoose.model(cartCollection, cartEsquema)