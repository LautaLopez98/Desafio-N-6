import { paginateSubDocs } from 'mongoose-paginate-v2';
import { cartModel } from './models/cartModel.js';


class CartManagerMONGO {
    async getCarts() {
        return await cartModel.find().lean();
    }

    async getCartById(id) {
        return await cartModel.findOne({_id:id}).populate("products.product").lean();
    }

    async createCart(cart){
        return await cartModel.create(cart)
    }

    async addToCart ( cid, pid ) {
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

    async deleteProduct(cid, pid) {
        try {
            let searchCart = cartModel.findOne({_id:cid});
            searchCart.products = searchCart.products.filter((p) => p.product._id != pid);
            await searchCart.save();
        } catch (error) {
            return `Error: product ${pid} not found`;
        }
    }

    async deleteProductInCart (cid, pid) {
        await cartModel.findByIdAndUpdate(cid, {$pull: { products: { product: pid } }});
    }

    async update(cid, carrito){
        return await cartModel.updateOne({_id:cid}, carrito)
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await cartModel.findOneAndUpdate(
            { _id: cartId, "products.id": productId },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
        ).lean();
    }
}



export default CartManagerMONGO;
