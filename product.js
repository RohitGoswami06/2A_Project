/* ========================= 
   RIPPLE EFFECT (shared) 
========================= */
function triggerRipple(btn) {
    if (!btn) return;
    const r = document.createElement('span');
    r.className = 'ripple';
    btn.appendChild(r);
    setTimeout(() => r.remove(), 620);
}

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Centralized Promise for fetching products.json 
let productsPromise = null;

function getProducts() {
    if (productsPromise) return productsPromise;
    productsPromise = fetch("products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error! Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            products = data;
            window.products = data;
            return data;
        })
        .catch(error => {
            console.error("Error loading products.json:", error);
            return [];
        });
    return productsPromise;
}

// Auto-initialize products loading and render default pages if containers exist 
getProducts().then(data => {
    if (document.getElementById("product-container")) {
        renderProducts();
    }
    if (document.getElementById("cart-container")) {
        renderCart();
    }
});

function findProduct(identifier) {
    if (typeof identifier === "number" || (!isNaN(identifier) && typeof identifier !== "object")) {
        const idNum = Number(identifier);
        return products.find(p => p.id === idNum);
    }
    return products.find(p => p.name === identifier);
}

function renderProducts(productIdentifiers) {
    const container = document.getElementById("product-container");
    if (!container) return;
    container.innerHTML = "";

    const list = productIdentifiers
        ? productIdentifiers.map(id => findProduct(id)).filter(Boolean)
        : products;

    list.forEach(product => {
        const productColumn = document.createElement("div");
        productColumn.className = "col-12 col-sm-6 col-lg-4";
        productColumn.innerHTML = ` 
            <div class="product-card mb-5"> 
                <div class="product-image position-relative"> 
                    <a href="product-detail.html?id=${product.id}"> 
                        <img src="${product.imageA}" alt="${product.name}" class="normal-image position-absolute top-0 start-0 w-100 h-100 object-fit-cover"> 
                        <img src="${product.imageB}" alt="${product.name}" class="hover-image position-absolute top-0 start-0 w-100 h-100 object-fit-cover"> 
                    </a> 
                    <div class="product-actions position-absolute top-0 end-0 d-flex flex-column gap-2 me-2 mt-2"> 
                        <button type="button" class="product-action btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" title="Add to cart" onclick='addToCart(${product.id}, this)'> 
                            <i class="bi bi-basket"></i> 
                        </button> 
                        <button type="button" class="product-action btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" title="View product" onclick='openProduct(${product.id})'> 
                            <i class="bi bi-eye"></i> 
                        </button> 
                    </div> 
                </div> 
                <div class="pt-2"> 
                    <a href="product-detail.html?id=${product.id}" class="text-decoration-none text-dark"> 
                        <div class="product-name text-uppercase mt-2 ms-3">${product.name}</div> 
                        <div class="product-price mt-1 ms-3">$${product.price.toFixed(2)}</div> 
                    </a> 
                </div> 
            </div>`;
        container.appendChild(productColumn);
    });
}

function addToCart(productOrId, btn) {
    if (btn) triggerRipple(btn);
    const prodObj = (typeof productOrId === 'object' && productOrId !== null) ? productOrId : findProduct(productOrId);
    if (!prodObj) return;

    const existingProduct = cart.find(item => item.id === prodObj.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id: prodObj.id, name: prodObj.name, price: prodObj.price, imageA: prodObj.imageA, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    if (typeof updateHeaderCart === 'function') updateHeaderCart();
}

function renderCart() {
    const cartContainer = document.getElementById("cart-container");
    if (!cartContainer) return;
    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="text-muted">Cart is empty.</p>`;
        return;
    }
    cartContainer.innerHTML = "";
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "d-flex justify-content-between align-items-center border-bottom py-2";
        cartItem.innerHTML = ` 
            <div> 
                <strong>${item.name}</strong> 
                <small class="text-muted d-block">$${item.price.toFixed(2)} × ${item.quantity}</small> 
            </div> 
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">Remove</button>`;
        cartContainer.appendChild(cartItem);
    });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    if (typeof updateHeaderCart === 'function') updateHeaderCart();
}

function openProduct(productOrId) {
    const product = (typeof productOrId === 'object' && productOrId !== null) ? productOrId : findProduct(productOrId);
    if (!product) return;

    const carouselInner = document.getElementById("modalCarouselInner");
    if (carouselInner) {
        carouselInner.innerHTML = "";
        const imgs = product.images || [product.imageA];
        imgs.forEach((src, i) => {
            const div = document.createElement("div");
            div.className = "carousel-item h-100" + (i === 0 ? " active" : "");
            div.innerHTML = `<img src="${src}" alt="${product.name}" class="w-100 h-100 object-fit-cover">`;
            carouselInner.appendChild(div);
        });
    }

    const catTop = document.getElementById("modalProductCategoryTop");
    if (catTop) catTop.textContent = product.category ? product.category.toUpperCase() : "";

    const titleEl = document.getElementById("productModalLabel");
    if (titleEl) titleEl.textContent = product.name;

    const priceEl = document.getElementById("modalProductPrice");
    if (priceEl) priceEl.textContent = "$" + (typeof product.price === 'number' ? product.price.toFixed(2) : product.price);

    const descriptionContainer = document.getElementById("modalProductDescription");
    if (descriptionContainer) {
        descriptionContainer.innerHTML = "";
        const descArr = Array.isArray(product.description) ? product.description : [product.description];
        descArr.forEach(paragraph => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            descriptionContainer.appendChild(p);
        });
    }

    const catBot = document.getElementById("modalProductCategoryBottom");
    if (catBot) catBot.textContent = product.category;

    const modalElement = document.getElementById("productModal");
    if (modalElement) {
        bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }
}

