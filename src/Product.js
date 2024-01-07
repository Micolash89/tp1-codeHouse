

class ProductManager {
    #products
    #id
    constructor() {
        this.#products = []
        this.#id = 0;
    }

    getProducts() {
        return this.#products;
    }

    addProduct(title, descripcion, price, thumbnail, code, stock) {

        if (title && descripcion && price && thumbnail && code && stock && !this.#products.find((product) => product.code == code)) {
            let id = ++this.#id;
            console.log(this.#id)
            this.#products.push({
                id,
                title,
                descripcion,
                price,
                thumbnail,
                code,
                stock

            })
        } else {
            console.log("error producto repetido o faltan campos")
        }
    }

    getProductsById(id) {
        let obj = this.#products.find((product) => product.id == id);
        return obj ? obj : `error no se encontro el producto ${id}`;
    }

}
