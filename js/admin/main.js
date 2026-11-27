import Product from "../model/Product.js";
import ProductService from "../service/productService.js";

// >>> Declare global varible
const service = new ProductService();


// >>> CRUD operation function

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

function addProduct(product) {
    const promise = service.addPrdouct(product);
    promise.then(function() {
        getAllProduct();
        closeProductModal();
    })
    .catch(function(error){
        alert(`Failed to add product: ${error}`);
    })
}

// >>> Rendering

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



// >>> Sub feature => Sorting, filtering keywork, validation

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

function validateText(text, divId) {
    if (text === null || text.trim() === "") {
        getId(`${divId}-error`).classList.remove("hidden");
        return false;
    }
    else {
        getId(`${divId}-error`).classList.add("hidden");
        return true;
    }
}

function validatePrice(value) {
    if (value === null || value.trim() === "") {
        getId("product-price-error").classList.remove("hidden");
        return false;
    }

    else if (value < 0) {
        getId("product-price-error").classList.remove("hidden");
        getId("product-price-error").innerHTML = "Price must be greater than 0";
        return false;
    }
    else {
        getId("product-price-error").classList.add("hidden");
        return true;
    }
}


// >>> Handle modal interaction and modal data

const addProductButton = getId("add-product-button");
const productFormSection = getId("product-form-section");
const productForm = getId("product-form");
const closeFormButton = getId("close-form-button");
const cancelFormButton = getId("cancel-form-button");

function openProductModal() {
    productFormSection.classList.remove("hidden");
    productFormSection.classList.add("flex");
}

function closeProductModal() {
    productFormSection.classList.add("hidden");
    productFormSection.classList.remove("flex");

    // Reset modal input
    productForm.reset();

    // Clear validation errors ([id$="-error"] find every tag with id end with error)
    // Example: product-brand-error, product-name-error, ...-error;
    document.querySelectorAll('[id$="-error"]').forEach(error => {
        error.classList.add("hidden");
    });
}


addProductButton.addEventListener("click", openProductModal);
closeFormButton.addEventListener("click", closeProductModal);
cancelFormButton.addEventListener("click", closeProductModal);

// Close model when click outside
productFormSection.addEventListener("click", (event) => {
    if (event.target === productFormSection) {
        closeProductModal();
    }
});

// Close model when hit Esc
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" &&
        !productFormSection.classList.contains("hidden")) {
        closeProductModal();
    }
});

function getDataFromModal() {
    const name = getId("product-name").value;
    const price = getId("product-price").value;
    const screen = getId("product-screen").value;
    const backCamera = getId("product-back-camera").value;
    const frontCamera = getId("product-front-camera").value;
    const img = getId("product-image").value;
    const desc = getId("product-description").value;
    const type = getId("product-brand").value;

    let isValid = true;

    isValid &= validateText(name, "product-name");
    isValid &= validateText(screen, "product-screen");
    isValid &= validateText(backCamera, "product-back-camera");
    isValid &= validateText(frontCamera, "product-front-camera");
    isValid &= validateText(type, "product-brand");
    isValid &= validatePrice(price);

    if (!isValid) return;

    const product = new Product("", name, price, screen, backCamera, frontCamera, img, desc, type);

    return product;
}



// >>> HTML interaction

getId("sort-price").onchange = (() => {
    getAllProduct();
})

getId("search-product").onkeyup = (() => {
    getAllProduct();
})

getId("product-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const data = getDataFromModal();
    if (data !== null) {
        addProduct(data);
    }
});

getAllProduct();

