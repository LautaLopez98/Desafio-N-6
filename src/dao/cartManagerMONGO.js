import { paginateSubDocs } from 'mongoose-paginate-v2';
import { cartModel } from './models/cartModel.js';


class CartManagerMONGO {
    async getCarts() {
        return await cartModel.find().populate("products.product").lean();
    }

    async getCartBy(filtro={}) {
        return await cartModel.findOne(filtro).lean();
    }

    async getCartById(id) {
        return await cartModel.findOne({_id:id}).lean();
    }

    async getCartByIdPopulate(id) {
        return await cartModel.findOne({_id:id}).populate("products.product").lean();
    }

    async createCart(cart){
        return await cartModel.create(cart)
    }

    async addToCart ( cid, pid ) {
        let cart = await cartModel.findOne({_id: cid}).populate("products.product").lean()
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

    async deleteProducts(cartId) {
        try {
            const result = await cartModel.findByIdAndUpdate(cartId, { $set: { products: [] } }, { new: true });
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar todos los productos del carrito: ${error}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const result = await cartModel.findOneAndUpdate(
                { _id: cartId, "products.product": productId },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error}`);
        }
    }

    async update(cartId, updatedCart) {
        try {
            const result = await cartModel.findByIdAndUpdate(cartId, updatedCart, { new: true });
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error}`);
        }
    }

    async deleteProductInCart(cartId, productId) {
        try {
            const result = await cartModel.findByIdAndUpdate(
                cartId,
                { $pull: { products: { product: productId } } },
                { new: true }
            );
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error}`);
        }
    }
    async update(cid, carrito){
        return await cartModel.updateOne({_id:cid}, carrito)
    }
}



export default CartManagerMONGO;
