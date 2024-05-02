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
        let productFound = cart.products.findIndex(product => String(product._id) == pid)

        if (productFound === -1) {
            cart.products.push({
                _id:pid,
                quantity: 1
            })
            let resp = await cartModel.findByIdAndUpdate({_id: cid}, cart)

            return resp
        }

        cart.products[productFound].quantity += 1
        let resp = await cartModel.findByIdAndUpdate({_id: cid}, cart)

        return resp
    }
}

export default CartManagerMONGO;
