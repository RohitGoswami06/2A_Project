/* ==========================================================================
   Eyewear Store - Men Products Page Logic (Exact 5 Products Order)
   ========================================================================== */

let menProductsList = [];
let rawMenProducts = [];
let menProductsMap = {};

function fetchMenProducts() {
    getProducts()
        .then(allProducts => {
            if (!allProducts || allProducts.length === 0) return;

            // Map all products for fast lookup
            allProducts.forEach(p => { menProductsMap[p.id] = p; });

            // EXACT 5 products in exact required order: Product Name 10, 12, 2, 3, 4
            const targetIds = [10, 12, 2, 3, 4];
            rawMenProducts = targetIds
                .map(id => findProduct(id))
                .filter(Boolean);

            menProductsList = [...rawMenProducts];

            renderMenPage();
        })
        .catch(err => console.error("Error loading products via product.js in men.js:", err));
}

function renderMenPage() {
    const container = document.getElementById('menProductsContainer');
    const countEl = document.getElementById('resultsCountText');

    if (!container) return;

    if (countEl) {
        countEl.textContent = `Showing all ${menProductsList.length} results`;
    }

    container.innerHTML = '';

    menProductsList.forEach(product => {
        let badgeHtml = '';
        let priceHtml = `<span class="fw-normal text-muted" style="font-size: 14px;">$${product.price.toFixed(2)}</span>`;

        // Retrieve oldPrice & discount dynamically from JSON product data
        const oldPrice = product.oldPrice;

        if (oldPrice && oldPrice > product.price) {
            const calculatedDiscountPct = Math.round(((oldPrice - product.price) / oldPrice) * 100);
            let discountLabel = product.discount;
            if (!discountLabel) {
                discountLabel = (product.id === 2) ? `${calculatedDiscountPct}%` : `-${calculatedDiscountPct}%`;
            }

            badgeHtml = `<span class="discount-badge">${discountLabel}</span>`;
            priceHtml = `<span class="text-muted text-decoration-line-through me-2" style="font-size: 14px;">$${parseFloat(oldPrice).toFixed(2)}</span><span class="fw-bold text-dark" style="font-size: 14px;">$${parseFloat(product.price).toFixed(2)}</span>`;
        }

        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4';
        col.innerHTML = `
            <div class="men-product-card">
                <div class="men-img-box position-relative">
                    <a href="product-detail.html?id=${product.id}">
                    <img src="${product.imageA}" alt="${product.name}" class="normal-img position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                    <img src="${product.imageB || product.imageA}" alt="${product.name}" class="hover-img position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                    </a>
                    
                    ${badgeHtml}

                    <div class="men-actions position-absolute top-0 end-0 d-flex flex-column gap-2 me-2 mt-2 z-2">
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
        menProductsList.sort((a, b) => b.id - a.id);
    } else if (val === 'price-low-high') {
        menProductsList.sort((a, b) => a.price - b.price);
    } else if (val === 'price-high-low') {
        menProductsList.sort((a, b) => b.price - a.price);
    } else {
        menProductsList = [...rawMenProducts];
    }
    renderMenPage();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMenProducts();

    const sortSelect = document.getElementById('sortingSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortingChange);
    }
});

