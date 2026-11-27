import ProductService from "../service/productService.js";

const service = new ProductService();

function getId(id) {
    return document.getElementById(id);
}

function getAllProduct() {
    const promise = service.getAllProduct();
    promise.then(function(result) {
        renderListProduct(result.data);
        return result.data;
    })
    .catch(function(error){
        alert(`Failed to fetch product list: ${error}`);
        return null;
    })
}

function renderListProduct(data) {
    let content = "";
    let sortedData = [];
    const sortType = getId("sort-price").value;
    if (sortType !== null && sortType !== "") {
        sortedData = sortProductByPrice(sortType, data);
    }
    else {
        sortedData = data;
    }
    sortedData.forEach(function(product, i) {
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

getId("sort-price").onchange = (() => {
    getAllProduct();
})

getAllProduct();