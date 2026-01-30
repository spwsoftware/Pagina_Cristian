const products = [
    {
        id: 1, name: "Casco SIC-PRO Amarillo", price: 185000, category: "cascos", tag: "Certificado ANSI",
        image: "./assets/casco.png", color: "orange",
        desc: "Casco de seguridad de alta resistencia con suspensión de 6 puntos. Diseñado para ofrecer máxima protección en entornos industriales exigentes.",
        colors: ["#FFB703", "#FFFFFF", "#023E8A"],
        images: {
            "#FFB703": "./assets/casco.png",
            "#FFFFFF": "./assets/casco-blanco.png",
            "#023E8A": "./assets/casco-azul.png"
        },
        sizes: ["Estándar"]
    },
    {
        id: 2, name: "Botas Industriales con Punta de Acero", price: 349900, category: "calzado", tag: "Máxima Protección",
        image: "./assets/botas.png", color: "black",
        desc: "Calzado de seguridad fabricado en cuero de alta calidad con puntera de acero certificada. Suela antideslizante y resistente a hidrocarburos.",
        colors: ["#1A1A1A", "#4A4A4A"],
        images: {
            "#1A1A1A": "./assets/botas.png",
            "#4A4A4A": "./assets/botas-gris.png"
        },
        sizes: ["38", "39", "40", "41", "42", "43"]
    },
    {
        id: 3, name: "Chaqueta Alta Visibilidad Pro", price: 145000, category: "ropa", tag: "Reflejante 3M",
        image: "./assets/chaqueta.png", color: "orange",
        desc: "Chaqueta impermeable de alta visibilidad con cintas reflectantes 3M. Ideal para trabajos en exteriores y condiciones de baja iluminación.",
        colors: ["#FFB703", "#39FF14"],
        images: {
            "#FFB703": "./assets/chaqueta.png",
            "#39FF14": "./assets/chaqueta-verde.png"
        },
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 4, name: "Guantes de Nitrilo Reforzado", price: 48000, category: "accesorios", tag: "Anticorte",
        image: "./assets/guantes.png", color: "blue",
        desc: "Guantes de nitrilo con refuerzo en palma y nudillos. Ofrecen excelente agarre y protección contra cortes y abrasiones.",
        colors: ["#023E8A", "#1A1A1A"],
        images: {
            "#023E8A": "./assets/guantes.png",
            "#1A1A1A": "./assets/guantes-negro.png"
        },
        sizes: ["M", "L"]
    },
    {
        id: 5, name: "Gafas de Protección UV SIC", price: 72500, category: "accesorios", tag: "Antiempañante",
        image: "./assets/gafas.png", color: "black",
        desc: "Gafas de seguridad con lentes de policarbonato y protección UV400. Tratamiento antiempañante y antirrayaduras.",
        colors: ["#1A1A1A", "#FFFFFF"],
        images: {
            "#1A1A1A": "./assets/gafas.png",
            "#FFFFFF": "./assets/gafas-blanco.png"
        },
        sizes: ["Única"]
    },
    {
        id: 6, name: "Arnés Anticaídas Profesional", price: 480000, category: "accesorios", tag: "Trabajo en Alturas",
        image: "./assets/arnes-azul.png", color: "blue",
        desc: "Arnés de cuerpo entero con 4 puntos de anclaje. Fabricado en reata de poliéster de alta tenacidad para máxima seguridad.",
        colors: ["#023E8A", "#FFC300", "#FF5733"],
        images: {
            "#023E8A": "./assets/arnes-azul.png",
            "#FFC300": "./assets/arnes-amarillo.png",
            "#FF5733": "./assets/arnes-naranja.png"
        },
        sizes: ["Ajustable"]
    }
];

// Current States
let currentFilters = { category: 'all', color: 'all', sort: 'default' };
let cart = JSON.parse(localStorage.getItem('sic_cart')) || [];

// Utils
const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
};

// Base Functions
function saveCart() { localStorage.setItem('sic_cart', JSON.stringify(cart)); }
function updateCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    counts.forEach(el => el.textContent = totalItems);
}

// Modal Logic
window.openModal = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');

    // Build Modal HTML
    content.innerHTML = `
        <div class="modal-product-grid">
            <div class="modal-image-col">
                <img src="${product.image}" alt="${product.name}" id="main-modal-img">
            </div>
            <div class="modal-info-col">
                <div class="modal-breadcrumbs">Inicio / ${product.category} / ${product.name}</div>
                <h2>${product.name}</h2>
                <div class="modal-price">${formatPrice(product.price)}</div>
                <p class="modal-desc">${product.desc}</p>
                
                <div class="modal-option-group">
                    <label>Seleccionar Color</label>
                    <div class="color-swatches">
                        ${product.colors.map((c, i) => `
                            <div class="swatch ${i === 0 ? 'active' : ''}" 
                                 style="background: ${c}" 
                                 data-color="${c}"
                                 onclick="selectSwatch(this, ${product.id})"></div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-option-group">
                    <label>Seleccionar Talla / Tamaño</label>
                    <div class="size-btns">
                        ${product.sizes.map((s, i) => `
                            <button class="size-btn ${i === 0 ? 'active' : ''}" 
                                    onclick="selectSize(this)">${s}</button>
                        `).join('')}
                    </div>
                </div>

                <div class="modal-actions">
                    <div class="modal-qty-cart">
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="updateModalQty(-1)">-</button>
                            <input type="number" id="modal-qty" value="1" min="1" readonly class="qty-input">
                            <button class="qty-btn" onclick="updateModalQty(1)">+</button>
                        </div>
                        <div style="display:flex; gap:10px; flex:1;">
                            <button class="btn btn-primary" style="flex:1" onclick="addFromModal(${product.id})">
                                Añadir al Carrito
                            </button>
                            <button class="btn btn-secondary" onclick="closeModal()">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeModal = () => {
    document.getElementById('product-modal').classList.remove('active');
    document.body.style.overflow = '';
};

// Selection Helpers
window.selectSwatch = (el, productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');

    // Change image
    const colorHex = el.getAttribute('data-color');
    const modalImg = document.getElementById('main-modal-img');

    if (product.images && product.images[colorHex] && modalImg) {
        modalImg.src = product.images[colorHex];
    }
};

window.selectSize = (el) => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
};

window.updateModalQty = (val) => {
    const input = document.getElementById('modal-qty');
    let current = parseInt(input.value);
    if (current + val >= 1) input.value = current + val;
};

// Cart Actions
window.addToCart = (id, quantity = 1) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    saveCart();
    updateCartCount();

    // Visual Feedback
    if (event && event.target.classList.contains('btn')) {
        const btn = event.target;
        const oldText = btn.textContent;
        btn.textContent = "¡Añadido!";
        setTimeout(() => btn.textContent = oldText, 1000);
    }
};

window.addFromModal = (id) => {
    const qty = parseInt(document.getElementById('modal-qty').value);
    window.addToCart(id, qty);
    window.closeModal();
};

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    if (typeof renderCheckout === 'function') renderCheckout();
};

// Rendering
function renderShop() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let filtered = products.filter(p => {
        const matchCat = currentFilters.category === 'all' || p.category === currentFilters.category;
        const matchColor = currentFilters.color === 'all' || p.color === currentFilters.color;
        return matchCat && matchColor;
    });

    if (currentFilters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (currentFilters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

    grid.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="product-image-container">
                <span class="product-tag">${p.tag}</span>
                <img src="${p.image}" alt="${p.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">${formatPrice(p.price)}</div>
                <button class="btn btn-primary btn-block">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('cat')) {
            currentFilters.category = params.get('cat');
            const sel = document.getElementById('cat-select');
            if (sel) sel.value = params.get('cat');
        }
        renderShop();

        // Listeners
        ['cat-select', 'color-select', 'sort-select'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const type = id.split('-')[0];
                    currentFilters[type === 'cat' ? 'category' : type] = e.target.value;
                    renderShop();
                });
            }
        });
    }

    // Payment Method Switching (Checkout)
    const methodOptions = document.querySelectorAll('.method-option');
    if (methodOptions.length > 0) {
        methodOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                const method = opt.getAttribute('data-method');

                // Update UI state
                methodOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');

                // Hide all contents
                document.querySelectorAll('.method-content').forEach(c => c.classList.remove('active'));

                // Show selected content
                const target = document.getElementById(`method-${method}`);
                if (target) target.classList.add('active');

                // Check radio button
                const radio = opt.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });
    }

    // Modal Background Close
    const modalOverlay = document.getElementById('product-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Escape Key Close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Checkout Logic (Shared if needed)
    if (document.getElementById('checkout-cart-list')) {
        renderCheckout();
    }
});

function renderCheckout() {
    const list = document.getElementById('checkout-cart-list');
    const totalEl = document.getElementById('checkout-total-val');
    if (!list || !totalEl) return;

    list.innerHTML = cart.map(item => `
        <div class="checkout-item" style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <div style="display:flex; gap:15px;">
                <img src="${item.image}" style="width:60px; height:60px; object-fit:contain;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Cantidad: ${item.quantity}</small>
                </div>
            </div>
            <div>
                <strong>${formatPrice(item.price * item.quantity)}</strong>
                <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; margin-left:10px; cursor:pointer;">&times;</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    totalEl.textContent = formatPrice(total);
}
