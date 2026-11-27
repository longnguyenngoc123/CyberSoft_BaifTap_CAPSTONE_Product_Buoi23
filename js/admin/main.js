import ProductService from "../service/productService.js";

const service = new ProductService();

function getId(id) {
    return document.getElementById(id);
}

function getAllProduct() {
    const promise = service.getAllProduct();
    promise.then(function(result) {
        let data = [];
        const sortType = getId("sort-price").value;
        const keyword = getId("search-product").value;
        data = doFilterSort(sortType, keyword, result.data);
        renderListProduct(data);
    })
    .catch(function(error){
        alert(`Failed to fetch product list: ${error}`);
    })
}

function renderListProduct(data) {
    let content = "";
    data.forEach(function(product, i) {
        content += `<tr>
                <td class="px-6 py-4">
                    <div class="text-xs text-slate-400">
                        ${i + 1}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-xs text-slate-400">
                        ${product.id}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold">
                        ${product.name}
                    </div>
                </td>

                <td class="px-6 py-4">
                    ${product.type}
                </td>
                <td class="px-6 py-4">
                    <img src="${product.img}" width="50"/>
                </td>
                <td class="px-6 py-4 font-semibold">
                    $${product.price}
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="rounded-lg bg-indigo-100 px-3 py-2 text-indigo-700">
                        Edit
                    </button>
                    <button class="rounded-lg bg-red-100 px-3 py-2 text-red-700">
                        Delete
                    </button>
                </td>
            </tr>`
    });
    getId("admin-product-list").innerHTML = content;
    getId("total-products").innerHTML = data.length;
    getId("samsung-products").innerHTML = data.filter((product) => 
        product.type === "Samsung").length;
    getId("iphone-products").innerHTML = data.filter((product) => 
        product.type === "Iphone").length;
}

function sortProductByPrice(sortType, listProduct) {
    
    return sortType === "asc" 
    ? [...listProduct].sort((a, b) => a.price - b.price)
    : [...listProduct].sort((a, b) => b.price - a.price);
}


function filterByKeyWord(keyword, listProduct) {
    return listProduct.filter((product) => 
        product.name.toLowerCase().includes(keyword.toLowerCase()));
}


function doFilterSort(sortType, keyword, listProduct) {
    let newList = [];
    if (keyword !== null && keyword !== "") {
            newList = filterByKeyWord(keyword, listProduct);
    }
    else {
        newList = listProduct;
    }

    if (sortType !== null && sortType !== "") {
        newList = sortProductByPrice(sortType, newList);
    }
    return newList;
}

getId("sort-price").onchange = (() => {
    getAllProduct();
})

getId("search-product").onkeyup = (() => {
    getAllProduct();
})

getAllProduct();