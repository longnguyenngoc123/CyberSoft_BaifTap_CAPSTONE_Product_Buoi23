class ProductService {

    constructor() {
        this.url = "https://6b026adf4a8cad87bd8fc79f.mockapi.io/product";
    };

    getAllProduct() {
        const promise = axios({
            url: this.url,
            method: "GET"
        })
        return promise;
    }


    

}

export default ProductService;