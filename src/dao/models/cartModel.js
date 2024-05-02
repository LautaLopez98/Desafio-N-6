import {Schema} from "mongoose"
import mongoose from "mongoose"

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
            timestamps: true,
        },

    ]
})

export const cartModel=mongoose.model(cartCollection, cartEsquema)