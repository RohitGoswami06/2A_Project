/* ==========================================================================
   Eyewear Store - Cart Page Logic (Matching Reference Image 1)
   ========================================================================== */

let appliedDiscount = 0;

function getCartData() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCartData(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (typeof updateHeaderCart === 'function') {
        updateHeaderCart();
    }
}

function renderCartPage() {
    const cart = getCartData();
    const cartContentSection = document.getElementById('cartContentSection');
    const emptyCartSection = document.getElementById('emptyCartSection');
    const cartTableBody = document.getElementById('cartTableBody');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');

    if (!cartContentSection || !emptyCartSection) return;

    if (cart.length === 0) {
        cartContentSection.classList.add('d-none');
        emptyCartSection.classList.remove('d-none');
        if (typeof updateHeaderCart === 'function') updateHeaderCart();
        return;
    }

    cartContentSection.classList.remove('d-none');
    emptyCartSection.classList.add('d-none');

    let subtotal = 0;
    cartTableBody.innerHTML = '';

    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="align-middle text-center" style="width: 40px;">
                <button type="button" class="btn-remove-circle" onclick="cartRemoveItem('${item.id}')" title="Remove item"><i class="bi bi-x-circle"></i></button>
            </td>
            <td class="align-middle" style="width: 80px;">
                <a href="product-detail.html?id=${item.id}">
                    <img src="${item.imageA || 'assets/product-01-a-600x600.jpg'}" alt="${item.name}" class="cart-item-img">
                </a>
            </td>
            <td class="align-middle">
                <a href="product-detail.html?id=${item.id}" class="cart-item-title">${item.name}</a>
            </td>
            <td class="align-middle text-nowrap text-muted">$${item.price.toFixed(2)}</td>
            <td class="align-middle">
                <div class="cart-qty-control">
                    <button type="button" class="cart-qty-btn" onclick="cartUpdateQty('${item.id}', -1)">-</button>
                    <input type="text" class="cart-qty-input" value="${item.quantity}" readonly aria-label="Quantity">
                    <button type="button" class="cart-qty-btn" onclick="cartUpdateQty('${item.id}', 1)">+</button>
                </div>
            </td>
            <td class="align-middle text-nowrap text-muted">$${itemSubtotal.toFixed(2)}</td>
        `;
        cartTableBody.appendChild(tr);
    });

    const discountValue = subtotal * appliedDiscount;
    const finalTotal = Math.max(0, subtotal - discountValue);

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${finalTotal.toFixed(2)}`;

    if (typeof updateHeaderCart === 'function') {
        updateHeaderCart();
    }
}

function cartUpdateQty(id, delta) {
    let cart = getCartData();
    const item = cart.find(i => String(i.id) === String(id));
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => String(i.id) !== String(id));
    }
    saveCartData(cart);
    renderCartPage();
}

function cartRemoveItem(id) {
    let cart = getCartData();
    cart = cart.filter(i => String(i.id) !== String(id));
    saveCartData(cart);
    renderCartPage();
}

function toggleCouponBox(e) {
    if (e) e.preventDefault();
    const box = document.getElementById('couponCollapseBox');
    if (box) {
        box.classList.toggle('d-none');
    }
}

function applyCoupon() {
    const input = document.getElementById('couponInput');
    const msgEl = document.getElementById('couponMessage');
    if (!input || !msgEl) return;

    const code = input.value.trim().toUpperCase();
    if (code === 'DISCOUNT10' || code === 'PROMO10' || code === 'SAVE10') {
        appliedDiscount = 0.10;
        msgEl.className = 'text-success small mt-2 fw-semibold';
        msgEl.textContent = 'Coupon applied! 10% discount added.';
    } else if (code.length > 0) {
        appliedDiscount = 0.05;
        msgEl.className = 'text-success small mt-2 fw-semibold';
        msgEl.textContent = `Coupon "${code}" applied! 5% discount added.`;
    } else {
        msgEl.className = 'text-danger small mt-2';
        msgEl.textContent = 'Please enter a valid coupon code.';
        return;
    }
    renderCartPage();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();

    const applyBtn = document.getElementById('applyCouponBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyCoupon);
    }
});
