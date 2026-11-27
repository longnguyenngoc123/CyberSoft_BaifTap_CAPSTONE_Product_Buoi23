class ProductService {

    constructor() {
        this.url = "https://6b026adf4a8cad87bd8fc79f.mockapi.io/product";
    };

    getAllProduct() {
        return axios({
            url: this.url,
            method: "GET"
        })
    }

    addPrdouct(product) {
        return axios({
            url: this.url,
            method: "POST",
            data: product
        })
    }


    

}

export default ProductService;