/* ==========================================================================
   Eyewear Store - Order Complete Page Logic (Exact Reference Match)
   ========================================================================== */

function getLatestOrder() {
    try {
        return JSON.parse(localStorage.getItem('latestOrder')) || null;
    } catch (e) {
        return null;
    }
}

function renderOrderCompletePage() {
    const order = getLatestOrder();
    
    // Fallback order data in case page is opened directly
    const orderData = order || {
        orderNumber: 1341,
        orderDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        customer: {
            email: 'rohitd.bca2024@ssism.org',
            firstName: 'roit',
            lastName: 'sd',
            country: 'India',
            streetAddress: 'qwes',
            apartment: 'sadfs',
            city: 'dfghgfd 234567',
            state: 'Madhya Pradesh',
            zip: '1234567890',
            phone: '1234567890'
        },
        paymentMethod: 'Cash on delivery',
        items: [
            { id: '9', name: 'Product Name 9', price: 135.00, quantity: 1, imageA: 'assets/product-09-a.jpg' }
        ],
        subtotal: 135.00,
        total: 135.00
    };

    const c = orderData.customer;

    // Header Titles
    const orderNumEl = document.getElementById('orderNumberDisplay');
    const thankYouEl = document.getElementById('thankYouDisplay');

    if (orderNumEl) orderNumEl.textContent = `Order #${orderData.orderNumber}`;
    if (thankYouEl) thankYouEl.textContent = `Thank you, ${c.firstName || 'Customer'}!`;

    // Left Side Customer Info Card Rows
    const contactEmailEl = document.getElementById('infoContactEmail');
    const addressBlockEl = document.getElementById('infoAddressBlock');
    const paymentMethodEl = document.getElementById('infoPaymentMethod');

    if (contactEmailEl) contactEmailEl.textContent = c.email;
    
    if (addressBlockEl) {
        const aptLine = c.apartment ? `<div>${c.apartment}</div>` : '';
        const stateCountryLine = c.state || c.country ? `<div>${[c.state, c.country].filter(Boolean).join(', ')}</div>` : '';
        addressBlockEl.innerHTML = `
            <div>${c.firstName} ${c.lastName}</div>
            <div>${c.streetAddress}</div>
            ${aptLine}
            <div>${c.city}</div>
            ${stateCountryLine}
            <div>${c.phone}</div>
            <div>${c.email}</div>
        `;
    }

    if (paymentMethodEl) paymentMethodEl.textContent = orderData.paymentMethod || 'Cash on delivery';

    // Right Side "Your Order" Product List
    const orderItemsContainer = document.getElementById('yourOrderItemsList');
    const rightSubtotalEl = document.getElementById('rightSubtotal');
    const rightTotalEl = document.getElementById('rightTotal');

    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = '';
        orderData.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
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
                <span class="product-price-text">$${itemTotal.toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(div);
        });
    }

    if (rightSubtotalEl) rightSubtotalEl.textContent = `$${orderData.subtotal.toFixed(2)}`;
    if (rightTotalEl) rightTotalEl.textContent = `$${orderData.total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderOrderCompletePage();
});
