/* ==========================================================================
   Eyewear Store - Vanilla JavaScript Interactive Application
   Recreation of: https://websitedemos.net/eyewear-store-04/
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. STATE MANAGEMENT (Cart Items)
    // --------------------------------------------------------------------------
    const cartState = {
        items: [
            {
                id: '1',
                name: 'Product Name 1',
                price: 150.00,
                quantity: 1,
                img: 'https://websitedemos.net/eyewear-store-04/wp-content/uploads/sites/1121/2022/09/product-01-a-600x600.jpg'
            }
        ]
    };

    // DOM Elements Cache
    const headerCartCountEl = document.getElementById('headerCartCount');
    const headerCartPrices = document.querySelectorAll('.cart-total-price');
    const cartDrawerSubtotalEl = document.getElementById('cartDrawerSubtotal');
    const cartItemsListEl = document.getElementById('cartItemsList');

    // Update Cart UI function
    function updateCartUI() {
        const totalCount = cartState.items.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = cartState.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Update badge count
        if (headerCartCountEl) {
            headerCartCountEl.textContent = totalCount;
        }

        // Update total prices
        headerCartPrices.forEach(priceEl => {
            priceEl.textContent = `$${subtotal.toFixed(2)}`;
        });

        if (cartDrawerSubtotalEl) {
            cartDrawerSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }

        // Render Cart Items List
        if (cartItemsListEl) {
            if (cartState.items.length === 0) {
                cartItemsListEl.innerHTML = `
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-basket fs-1 mb-2 d-block opacity-50"></i>
                        <p class="mb-0">Your shopping cart is empty.</p>
                    </div>
                `;
            } else {
                cartItemsListEl.innerHTML = cartState.items.map(item => `
                    <div class="cart-item d-flex align-items-center gap-3 pb-3 border-bottom mb-3" data-id="${item.id}">
                        <img src="${item.img}" alt="${item.name}" class="rounded cart-item-thumb" width="60" height="60">
                        <div class="cart-item-details flex-grow-1">
                            <h6 class="cart-item-title mb-1 fw-bold text-dark font-montserrat">${item.name}</h6>
                            <div class="cart-item-price small text-muted">${item.quantity} &times; $${item.price.toFixed(2)}</div>
                        </div>
                        <button type="button" class="btn-remove-cart-item btn-close small shadow-none" data-id="${item.id}" aria-label="Remove ${item.name}"></button>
                    </div>
                `).join('');
            }
        }
    }

    // Initialize UI
    updateCartUI();

    // --------------------------------------------------------------------------
    // 2. FULLSCREEN SEARCH OVERLAY MODAL
    // --------------------------------------------------------------------------
    const searchOverlayModal = document.getElementById('searchOverlayModal');
    const searchTriggerBtn = document.getElementById('searchTriggerBtn');
    const closeSearchModalBtn = document.getElementById('closeSearchModalBtn');
    const searchInputField = document.getElementById('searchInputField');

    function openSearchModal() {
        if (searchOverlayModal) {
            searchOverlayModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (searchInputField) {
                setTimeout(() => searchInputField.focus(), 150);
            }
        }
    }

    function closeSearchModal() {
        if (searchOverlayModal) {
            searchOverlayModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (searchTriggerBtn) {
        searchTriggerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openSearchModal();
        });
    }

    if (closeSearchModalBtn) {
        closeSearchModalBtn.addEventListener('click', closeSearchModal);
    }

    if (searchOverlayModal) {
        searchOverlayModal.addEventListener('click', (e) => {
            if (e.target === searchOverlayModal) {
                closeSearchModal();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 3. SLIDE-OUT CART OFFCANVAS DRAWER
    // --------------------------------------------------------------------------
    const astraCartDrawer = document.getElementById('astraCartDrawer');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    const cartTriggerBtn = document.getElementById('cartTriggerBtn');
    const closeCartDrawerBtn = document.getElementById('closeCartDrawerBtn');

    function openCartDrawer() {
        if (astraCartDrawer && cartDrawerOverlay) {
            astraCartDrawer.classList.add('active');
            cartDrawerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCartDrawer() {
        if (astraCartDrawer && cartDrawerOverlay) {
            astraCartDrawer.classList.remove('active');
            cartDrawerOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (cartTriggerBtn) {
        cartTriggerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    }

    if (closeCartDrawerBtn) {
        closeCartDrawerBtn.addEventListener('click', closeCartDrawer);
    }

    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', closeCartDrawer);
    }

    // --------------------------------------------------------------------------
    // 4. ADD TO CART & REMOVE FROM CART DELEGATION
    // --------------------------------------------------------------------------
    const actionToastEl = document.getElementById('actionToast');
    const actionToastBodyEl = document.getElementById('actionToastBody');

    function showToastNotification(msg) {
        if (actionToastEl) {
            if (actionToastBodyEl) {
                actionToastBodyEl.textContent = msg;
            }
            const bsToast = new bootstrap.Toast(actionToastEl);
            bsToast.show();
        }
    }

    // Add to Cart Event Listener (Delegated)
    document.addEventListener('click', (e) => {
        const btnAdd = e.target.closest('.btn-add-to-cart');
        if (btnAdd) {
            e.preventDefault();
            const name = btnAdd.getAttribute('data-name') || 'Eyewear Frame';
            const price = parseFloat(btnAdd.getAttribute('data-price')) || 125.00;
            const img = btnAdd.getAttribute('data-img') || 'https://websitedemos.net/eyewear-store-04/wp-content/uploads/sites/1121/2022/09/product-01-a-600x600.jpg';

            // Check if item exists in state
            const existingItem = cartState.items.find(i => i.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartState.items.push({
                    id: Date.now().toString(),
                    name: name,
                    price: price,
                    quantity: 1,
                    img: img
                });
            }

            updateCartUI();
            showToastNotification(`"${name}" has been added to your cart.`);
            setTimeout(openCartDrawer, 300);
        }

        // Remove item from cart listener
        const btnRemove = e.target.closest('.btn-remove-cart-item');
        if (btnRemove) {
            e.preventDefault();
            const id = btnRemove.getAttribute('data-id');
            const itemIdx = cartState.items.findIndex(i => i.id === id);
            if (itemIdx > -1) {
                const removedName = cartState.items[itemIdx].name;
                cartState.items.splice(itemIdx, 1);
                updateCartUI();
                showToastNotification(`"${removedName}" removed from cart.`);
            }
        }
    });

    // --------------------------------------------------------------------------
    // 5. MOBILE NAVIGATION DRAWER
    // --------------------------------------------------------------------------
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavCloseBtn = document.getElementById('mobileNavCloseBtn');

    function openMobileNav() {
        if (mobileNavDrawer && mobileNavOverlay) {
            mobileNavDrawer.classList.add('active');
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileNav() {
        if (mobileNavDrawer && mobileNavOverlay) {
            mobileNavDrawer.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuTrigger) {
        mobileMenuTrigger.addEventListener('click', openMobileNav);
    }

    if (mobileNavCloseBtn) {
        mobileNavCloseBtn.addEventListener('click', closeMobileNav);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileNav);
    }

    // Close mobile menu on nav link click
    if (mobileNavDrawer) {
        const mobileNavLinks = mobileNavDrawer.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    // --------------------------------------------------------------------------
    // 6. QUICK VIEW LIGHTBOX POPULATING
    // --------------------------------------------------------------------------
    const quickViewLightboxEl = document.getElementById('quickViewLightbox');
    const qvModalTitle = document.getElementById('qvModalTitle');
    const qvModalPrice = document.getElementById('qvModalPrice');
    const qvModalImg = document.getElementById('qvModalImg');
    const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');

    document.addEventListener('click', (e) => {
        const btnQV = e.target.closest('.btn-quick-view');
        if (btnQV) {
            e.preventDefault();
            const name = btnQV.getAttribute('data-name') || 'Original Sunglasses';
            const price = btnQV.getAttribute('data-price') || '$135.00';
            const img = btnQV.getAttribute('data-img') || 'https://websitedemos.net/eyewear-store-04/wp-content/uploads/sites/1121/2022/09/product-10-a-600x600.jpg';

            if (qvModalTitle) qvModalTitle.textContent = name;
            if (qvModalPrice) qvModalPrice.textContent = price;
            if (qvModalImg) qvModalImg.src = img;

            if (qvAddToCartBtn) {
                qvAddToCartBtn.setAttribute('data-name', name);
                qvAddToCartBtn.setAttribute('data-price', price.replace('$', ''));
                qvAddToCartBtn.setAttribute('data-img', img);
            }

            if (quickViewLightboxEl) {
                const bsModal = new bootstrap.Modal(quickViewLightboxEl);
                bsModal.show();
            }
        }
    });

    // --------------------------------------------------------------------------
    // 7. KEYBOARD ESCAPE SHORTCUT HANDLER
    // --------------------------------------------------------------------------
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearchModal();
            closeCartDrawer();
            closeMobileNav();
        }
    });

});
