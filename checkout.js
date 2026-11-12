/* ==========================================================================
   Eyewear Store - Checkout Details Page Logic (Exact Reference Match)
   ========================================================================== */

let checkoutDiscount = 0;

function getCartData() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        return [];
    }
}

function renderCheckoutSummary() {
    const cart = getCartData();
    const itemsContainer = document.getElementById('checkoutSummaryItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const totalEl = document.getElementById('checkoutTotal');
    const btnTotalEl = document.getElementById('btnOrderTotal');

    if (!itemsContainer) return;

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    let subtotal = 0;
    itemsContainer.innerHTML = '';

    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const div = document.createElement('div');
        div.className = 'd-flex align-items-center justify-content-between mb-4';
        div.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="product-thumb-box">
                    <img src="${item.imageA || 'assets/product-01-a-600x600.jpg'}" alt="${item.name}">
                    <span class="qty-badge-top-right">${item.quantity}</span>
                </div>
                <span class="product-name-text">${item.name}</span>
            </div>
            <span class="product-price-text">$${itemSubtotal.toFixed(2)}</span>
        `;
        itemsContainer.appendChild(div);
    });

    const discountAmount = subtotal * checkoutDiscount;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
    if (btnTotalEl) btnTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
}

function setupPaymentOptions() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-row').forEach(row => row.classList.remove('selected'));
            document.querySelectorAll('.payment-desc-content').forEach(box => box.classList.add('d-none'));

            const row = e.target.closest('.payment-row');
            if (row) row.classList.add('selected');

            const targetDescId = e.target.getAttribute('data-desc-id');
            if (targetDescId) {
                const descBox = document.getElementById(targetDescId);
                if (descBox) descBox.classList.remove('d-none');
            }
        });
    });
}

function applyCoupon() {
    const input = document.getElementById('couponInput');
    const msgEl = document.getElementById('couponMessage');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (code === 'DISCOUNT10' || code === 'PROMO10' || code === 'SAVE10') {
        checkoutDiscount = 0.10;
        if (msgEl) {
            msgEl.className = 'text-success small mt-2 fw-semibold';
            msgEl.textContent = '10% discount applied!';
        }
    } else if (code.length > 0) {
        checkoutDiscount = 0.05;
        if (msgEl) {
            msgEl.className = 'text-success small mt-2 fw-semibold';
            msgEl.textContent = `Coupon "${code}" applied (5% off).`;
        }
    } else {
        if (msgEl) {
            msgEl.className = 'text-danger small mt-2';
            msgEl.textContent = 'Please enter a valid coupon code.';
        }
        return;
    }
    renderCheckoutSummary();
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');

        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalid.focus();
        }
        return;
    }

    const cart = getCartData();
    if (cart.length === 0) {
        alert('Your cart is empty.');
        window.location.href = 'cart.html';
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal * (1 - checkoutDiscount);

    const selectedPaymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethodText = selectedPaymentRadio && selectedPaymentRadio.value === 'bank' 
        ? 'Direct bank transfer' 
        : 'Cash on delivery';

    const randomOrderNum = Math.floor(1000 + Math.random() * 9000);

    const orderData = {
        orderNumber: randomOrderNum,
        orderDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        customer: {
            email: document.getElementById('billingEmail').value.trim(),
            firstName: document.getElementById('billingFirstName').value.trim(),
            lastName: document.getElementById('billingLastName').value.trim(),
            country: document.getElementById('billingCountry').value,
            streetAddress: document.getElementById('billingAddress').value.trim(),
            apartment: document.getElementById('billingApartment') ? document.getElementById('billingApartment').value.trim() : '',
            city: document.getElementById('billingCity').value.trim(),
            state: document.getElementById('billingState').value,
            zip: document.getElementById('billingZip').value.trim(),
            phone: document.getElementById('billingPhone').value.trim(),
            orderNotes: document.getElementById('orderNotes') ? document.getElementById('orderNotes').value.trim() : ''
        },
        paymentMethod: paymentMethodText,
        items: cart,
        subtotal: subtotal,
        total: finalTotal
    };

    // Save order payload
    localStorage.setItem('latestOrder', JSON.stringify(orderData));

    // Clear active cart
    localStorage.setItem('cart', JSON.stringify([]));

    // Navigate to Order Complete Page
    window.location.href = 'order-complete.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutSummary();
    setupPaymentOptions();

    const applyBtn = document.getElementById('applyCouponBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyCoupon);
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
});
