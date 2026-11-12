function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function updateHeaderCart() {
    const cart = getCart();
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const t = document.getElementById("headerCartTotal");
    const c = document.getElementById("headerCartCount");
    if (t) t.textContent = "$" + total.toFixed(2);
    if (c) c.textContent = count;
}

function openCartPanel() {
    renderCartPanel();
    document.getElementById("cartPanel").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
}

function closeCartPanel() {
    document.getElementById("cartPanel").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("open");
}

function renderCartPanel() {
    const cart = getCart();
    const container = document.getElementById("cartPanelItems");
    const subtotalEl = document.getElementById("cartPanelSubtotal");
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100 py-5 text-center">
               
                <p style="color:#999;font-size:17px;margin-top:0px">No products in the cart.</p>
            </div>`;
        subtotalEl.textContent = "$0.00";
        const footer = container.closest('.cart-panel').querySelector('.border-top');
        if (footer) footer.innerHTML = `
            <button class="btn btn-outline-dark w-100 fw-bold text-uppercase cart-btn" onclick="window.location.href='women.html'; closeCartPanel();">CONTINUE SHOPPING</button>`;
        updateHeaderCart();
        return;
    }
    const footer = container.closest('.cart-panel').querySelector('.border-top');
    if (footer) footer.innerHTML = `
        <div class="d-flex justify-content-between fw-semibold mb-3 pb-3 border-bottom">
            <span>Subtotal:</span>
            <span id="cartPanelSubtotal">$0.00</span>
        </div>
        <button class="btn btn-outline-dark w-100 fw-bold text-uppercase mb-2 cart-btn" onclick="window.location.href='cart.html'">VIEW CART</button>
        <button class="btn btn-outline-dark w-100 fw-bold text-uppercase cart-btn" onclick="window.location.href='checkout.html'">CHECKOUT</button>`;
    const newSubtotalEl = document.getElementById("cartPanelSubtotal") || subtotalEl;
    container.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.className = "d-flex align-items-center gap-3 py-3 border-bottom";
        div.innerHTML = `
            <img src="${item.imageA || ''}" alt="${item.name}" class="object-fit-cover bg-light" style="width:72px;height:72px">
            <div class="flex-grow-1">
                <div class="fw-semibold mb-2" style="font-size:13px">${item.name}</div>
                <div class="cart-qty d-flex align-items-center">
                    <button onclick="changeQty(${item.id}, -1)">-</button>
                    <span class="d-flex align-items-center justify-content-center">${item.quantity}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="fw-semibold text-nowrap" style="font-size:13px">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center align-self-start" style="width:22px;height:22px;font-size:11px" onclick="removeItem(${item.id})">&#x2715;</button>
        `;
        container.appendChild(div);
    });
    newSubtotalEl.textContent = "$" + total.toFixed(2);
    updateHeaderCart();
}

function changeQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPanel();
}

function removeItem(id) {
    let cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    renderCartPanel();
}

window.addEventListener("storage", updateHeaderCart);

fetch('header.html')
    .then(r => r.text())
    .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const navRow = doc.querySelector('.row.align-items-center');
        if (navRow) {
            document.getElementById('header-nav').innerHTML = navRow.outerHTML;
        }
        // Active link
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-linkk').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) link.classList.add('active');
        });
        // Header type class
        const headerEl = document.querySelector('header');
        if (headerEl) {
            if (headerEl.classList.contains('border-bottom')) {
                headerEl.classList.add('header-white');
            } else {
                headerEl.classList.add('header-dark');
            }
        }
        updateHeaderCart();
    });
