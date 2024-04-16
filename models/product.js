const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const Cart = require('./cart')

const getProductsFromFile = (cb) => {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
               cb([]);
            } else {
                cb(JSON.parse(fileContent));
            }
        });
};

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (!Array.isArray(products)) {
                products = []; // Initialize products as an empty array if it's not defined or not an array
            }
            if (this.id) {
                // Update existing product
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            } else {
                // Add new product
                this.id = Math.random().toString();
                products.push(this); // Add this product to the products array
                fs.writeFile(p, JSON.stringify(products), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    }
    
    static deleteById(id) {
        getProductsFromFile(products => {
            const productIndex = products.findIndex(prod => prod.id === id);
            if (productIndex !== -1) { // Check if product with given id exists
                const deletedProduct = products.splice(productIndex, 1)[0]; // Remove the product from array
                fs.writeFile(p, JSON.stringify(products), err => {
                    if (!err) {
                        Cart.deleteProduct(id, deletedProduct.price); // Update cart after deletion
                    } else {
                        console.error(err);
                    }
                });
            } else {
                console.log("Product not found with id:", id);
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
}
    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            cb(product);
        });
    }
};