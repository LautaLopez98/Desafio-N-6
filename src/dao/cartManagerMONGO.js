import { cartModel } from './models/cartModel.js';


class CartManagerMONGO {
    async getCartById(id) {
        return await cartModel.find({_id:id});
    }

    async createCart(cart){
        return await cartModel.create(cart)
    }

    addToCart = async ( cid, pid ) => {
        let cart = await cartModel.findOne({_id: cid})
        let productFound = cart.products.find(product => {
            return product.id.toString() === pid;
        });
        if (productFound) {
            productFound.quantity++
        } else {
            cart.products.push({
                id:pid,
                quantity: 1
            })
        }
        await cart.save();
    }
}

export default CartManagerMONGO;
