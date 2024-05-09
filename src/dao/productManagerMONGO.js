import __dirname from '../../utils.js';
import { productsModel } from './models/productModel.js';
import mongoose from "mongoose";

class ProductManagerMONGO {
    async addProduct(product) {
        return await productsModel.create(product);
    }

    async getProducts(limit = 10, page = 1, sort = null, query = {}) {
        const options = {
            limit,
            page,
            lean: true
        };

        if (sort) {
            options.sort = { price: sort === "asc" ? 1 : -1 };
        }

        let filter = { status: true };

        if (query.category) {
            filter.category = query.category;
        }
        if (query.stock) {
            filter.stock = { $gt: 0 };
        }

        const result = await productsModel.paginate(filter, options);

        const totalPages = result.totalPages;
        const currentPage = result.page;
        const hasPrevPage = result.hasPrevPage;
        const hasNextPage = result.hasNextPage;
        const prevPage = result.prevPage;
        const nextPage = result.nextPage;

        const prevLink = hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}` : null;

        return {
            status: "success",
            payload: result.docs,
            totalPages,
            prevPage,
            nextPage,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        };
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