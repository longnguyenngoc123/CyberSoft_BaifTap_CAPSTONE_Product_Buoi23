import ProductService from "../service/productService.js";
import CartItem from "../model/CartItem.js";

const service = new ProductService();
const CART_STORAGE_KEY = "MOBILEHUB_CART";

let productList = [];
let cart = [];

function getId(id) {
  return document.getElementById(id);
}

// 1. GỌI API & HIỂN THỊ DANH SÁCH SẢN PHẨM
function getAllProducts() {
  service
    .getAllProduct()
    .then(function (result) {
      productList = result.data;
      renderProducts(productList);
    })
    .catch(function (error) {
      alert(`Failed to fetch product list: ${error}`);
    });
}

function renderProducts(data) {
  const productListEl = getId("product-list");
  const productEmptyEl = getId("product-empty");

  if (!data || data.length === 0) {
    productListEl.innerHTML = "";
    productEmptyEl.classList.remove("hidden");
    return;
  }

  productEmptyEl.classList.add("hidden");

  let content = "";
  data.forEach(function (product) {
    const price = Number(product.price).toLocaleString();
    const backCam = product.backCamera || product.blackCamera || "";

    content += `
      <article class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
        <div class="flex h-52 items-center justify-center bg-slate-50 p-5">
          <img
            src="${product.img}"
            alt="${product.name}"
            class="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </div>
        <div class="flex flex-1 flex-col p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-brand">${product.type}</p>
          <h3 class="mt-2 text-lg font-bold text-ink">${product.name}</h3>
          <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">${product.desc || ""}</p>
          ${
            product.screen
              ? `<p class="mt-3 text-xs text-slate-400">Screen: ${product.screen}${backCam ? ` • Cam: ${backCam}` : ""}</p>`
              : ""
          }
          <div class="mt-auto flex items-center justify-between gap-3 pt-5">
            <span class="text-lg font-black text-ink">$${price}</span>
            <button
              type="button"
              onclick="addToCart('${product.id}')"
              class="rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Add to cart
            </button>
          </div>
        </div>
      </article>
    `;
  });

  productListEl.innerHTML = content;
}

// 2. LỌC SẢN PHẨM THEO HÃNG (FILTER)
function filterProducts() {
  const selectedType = getId("product-filter").value.toLowerCase();

  if (selectedType === "all") {
    renderProducts(productList);
    return;
  }

  const filteredList = productList.filter(function (product) {
    return String(product.type).toLowerCase() === selectedType;
  });

  renderProducts(filteredList);
}

// 3. GIỎ HÀNG: THÊM, TĂNG/GIẢM, XÓA, RENDER
function addToCart(productId) {
  const foundProduct = productList.find(
    (item) => String(item.id) === String(productId)
  );
  if (!foundProduct) return;

  const existingItem = cart.find(
    (item) => String(item.product.id) === String(productId)
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(new CartItem(foundProduct, 1));
  }

  saveCart();
  renderCart();
}

function changeQuantity(productId, delta) {
  const index = cart.findIndex(
    (item) => String(item.product.id) === String(productId)
  );
  if (index === -1) return;

  cart[index].quantity += delta;

  // Nếu giảm xuống 0 thì xóa khỏi giỏ hàng
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => String(item.product.id) !== String(productId));
  saveCart();
  renderCart();
}

function renderCart() {
  const cartListEl = getId("cart-list");
  const cartCountEl = getId("cart-count");
  const cartItemsLabelEl = getId("cart-items-label");
  const cartTotalEl = getId("cart-total");

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.calcTotal(), 0);

  cartCountEl.textContent = totalQty;
  cartItemsLabelEl.textContent = `${totalQty} ${totalQty === 1 ? "item" : "items"}`;
  cartTotalEl.textContent = `$${totalPrice.toLocaleString()}`;

  if (cart.length === 0) {
    cartListEl.innerHTML = `
      <tr id="cart-placeholder">
        <td colspan="5" class="px-3 py-10 text-center text-slate-400">Your cart is empty.</td>
      </tr>
    `;
    return;
  }

  let content = "";
  cart.forEach(function (item) {
    const { product, quantity } = item;
    const unitPrice = Number(product.price).toLocaleString();
    const subtotal = item.calcTotal().toLocaleString();

    content += `
      <tr>
        <td class="px-3 py-4">
          <div class="flex items-center gap-3">
            <img
              src="${product.img}"
              alt="${product.name}"
              class="h-12 w-12 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1"
            />
            <div>
              <p class="font-bold text-ink">${product.name}</p>
              <p class="text-xs uppercase tracking-wider text-slate-400">${product.type}</p>
            </div>
          </div>
        </td>
        <td class="px-3 py-4 font-medium text-slate-600">$${unitPrice}</td>
        <td class="px-3 py-4">
          <div class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onclick="changeQuantity('${product.id}', -1)"
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
              aria-label="Decrease quantity"
            >−</button>
            <span class="min-w-6 text-center text-sm font-bold text-ink">${quantity}</span>
            <button
              type="button"
              onclick="changeQuantity('${product.id}', 1)"
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
              aria-label="Increase quantity"
            >+</button>
          </div>
        </td>
        <td class="px-3 py-4 text-right font-bold text-ink">$${subtotal}</td>
        <td class="px-3 py-4 text-right">
          <button
            type="button"
            onclick="removeFromCart('${product.id}')"
            class="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            Remove
          </button>
        </td>
      </tr>
    `;
  });

  cartListEl.innerHTML = content;
}

// 4. THANH TOÁN & LƯU LOCALSTORAGE
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  cart = [];
  saveCart();
  renderCart();
  alert("Checkout successful! Thank you for your purchase.");
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  if (!data) return;

  try {
    const parsed = JSON.parse(data);
    cart = parsed.map((item) => new CartItem(item.product, item.quantity));
  } catch {
    cart = [];
  }
}

window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;

getId("product-filter").onchange = filterProducts;
getId("checkout-button").onclick = checkout;

const headerCartBtn = getId("header-cart-btn");
if (headerCartBtn) {
  headerCartBtn.onclick = () => {
    getId("cart").scrollIntoView({ behavior: "smooth" });
  };
}

loadCart();
renderCart();
getAllProducts();