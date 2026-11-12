/* ==========================================================================
   Eyewear Store - Women Products Page Logic (Exact 7 Products Order)
   ========================================================================== */

let womenProductsList = [];
let rawWomenProducts = [];
let womenProductsMap = {};

function fetchWomenProducts() {
    getProducts()
        .then(allProducts => {
            if (!allProducts || allProducts.length === 0) return;

            // Map all products for fast lookup
            allProducts.forEach(p => { womenProductsMap[p.id] = p; });

            // EXACT 7 products in exact required order: Product 1, 11, 5, 6, 7, 8, 9
            const targetIds = [1, 11, 5, 6, 7, 8, 9];
            rawWomenProducts = targetIds
                .map(id => findProduct(id))
                .filter(Boolean);

            womenProductsList = [...rawWomenProducts];

            renderWomenPage();
        })
        .catch(err => console.error("Error loading products via product.js in women.js:", err));
}

function renderWomenPage() {
    const container = document.getElementById('womenProductsContainer');
    const countEl = document.getElementById('resultsCountText');

    if (!container) return;

    if (countEl) {
        countEl.textContent = `Showing all ${womenProductsList.length} results`;
    }

    container.innerHTML = '';

    womenProductsList.forEach(product => {
        let badgeHtml = '';
        let priceHtml = `<span class="fw-bold text-muted">$${product.price.toFixed(2)}</span>`;

        // Handle Sale Prices and Discount Badges dynamically from product data
        if (product.oldPrice && product.oldPrice > product.price) {
            const discountPct = product.discount || `-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%`;
            badgeHtml = `<span class="badge bg-white text-dark rounded-pill shadow-sm position-absolute top-0 start-0 m-3 px-3 py-2 fw-normal" style="border:1px solid #eee; font-size:12px;">${discountPct}</span>`;
            priceHtml = `<span class="text-muted text-decoration-line-through me-2">$${parseFloat(product.oldPrice).toFixed(2)}</span><span class="fw-bold text-dark">$${parseFloat(product.price).toFixed(2)}</span>`;
        }

        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4';
        col.innerHTML = `
            <div class="women-product-card">
                <div class="women-img-box position-relative">
                    <a href="product-detail.html?id=${product.id}">
                    <img src="${product.imageA}" alt="${product.name}" class="normal-img position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                    <img src="${product.imageB || product.imageA}" alt="${product.name}" class="hover-img position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                    </a>
                    
                    ${badgeHtml}

                    <div class="women-actions position-absolute top-0 end-0 d-flex flex-column gap-2 me-2 mt-2 z-2">
                        <button type="button" class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" style="width:38px;height:38px;" title="Add to cart" onclick='addToCart(${product.id}, this)'>
                            <i class="bi bi-basket" style="font-size:14px;"></i>
                        </button>
                        <button type="button" class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" style="width:38px;height:38px;" title="View product" onclick="openProduct(${product.id})">
                            <i class="bi bi-eye" style="font-size:14px;"></i>
                        </button>
                    </div>
                </div>
                <div class="pt-2">
                    <a href="product-detail.html?id=${product.id}" class="text-decoration-none text-dark">
                        <div class="product-name">${product.name}</div>
                    </a>
                    <div class="product-card-price">${priceHtml}</div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function handleSortingChange(e) {
    const val = e.target.value;
    if (val === 'latest') {
        womenProductsList.sort((a, b) => b.id - a.id);
    } else if (val === 'price-low-high') {
        womenProductsList.sort((a, b) => a.price - b.price);
    } else if (val === 'price-high-low') {
        womenProductsList.sort((a, b) => b.price - a.price);
    } else {
        womenProductsList = [...rawWomenProducts];
    }
    renderWomenPage();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWomenProducts();

    const sortSelect = document.getElementById('sortingSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortingChange);
    }
});

