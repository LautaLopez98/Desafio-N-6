import __dirname from '../../utils.js';
import { productsModel } from './models/productModel.js';
import mongoose from "mongoose";

class ProductManagerMONGO {
    async addProduct(product) {
        return await productsModel.create(product);
    }

    async getProducts() {
        return await productsModel.find().lean();
    }

    async getProductById(filtro={}) {
        return await productsModel.findOne(filtro).lean();
    }

    async updateProduct(productId, newProductData) {
        try {
            const updatedProduct = await productsModel.findOneAndUpdate(
                { _id: productId },
                newProductData,
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al actualizar el producto con id ${productId}: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        return await productsModel.deleteOne({ _id: id });
    }
}

export default ProductManagerMONGO