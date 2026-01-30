const products = [
    { id: 1, name: "Casco SIC-PRO Amarillo", price: 45.00, category: "cascos", tag: "Certificado ANSI", image: "assets/casco.png", color: "orange" },
    { id: 2, name: "Botas Industriales con Punta de Acero", price: 89.90, category: "calzado", tag: "Máxima Protección", image: "assets/botas.png", color: "black" },
    { id: 3, name: "Chaqueta Alta Visibilidad Pro", price: 35.50, category: "ropa", tag: "Reflejante 3M", image: "assets/chaqueta.png", color: "orange" },
    { id: 4, name: "Guantes de Nitrilo Reforzado", price: 12.00, category: "accesorios", tag: "Anticorte", image: "assets/guantes.png", color: "blue" },
    { id: 5, name: "Gafas de Protección UV SIC", price: 18.25, category: "accesorios", tag: "Antiempañante", image: "assets/gafas.png", color: "black" },
    { id: 6, name: "Arnés Anticaídas Profesional", price: 120.00, category: "accesorios", tag: "Trabajo en Alturas", image: "assets/arnes.png", color: "blue" },
    { id: 7, name: "Casco SIC Blanco Supervisor", price: 48.00, category: "cascos", tag: "Premium", image: "assets/casco.png", color: "white" },
    { id: 8, name: "Bota de Seguridad Dielectrica", price: 95.00, category: "calzado", tag: "Anti-Electricidad", image: "assets/botas.png", color: "black" },
    { id: 9, name: "Overol Industrial Dril SIC", price: 65.00, category: "ropa", tag: "Resistente", image: "assets/chaqueta.png", color: "blue" },
    { id: 10, name: "Filtro Respirador Multigas", price: 28.50, category: "accesorios", tag: "Certificado NIOSH", image: "assets/gafas.png", color: "black" },
    { id: 11, name: "Protectores Copas para Casco", price: 32.00, category: "accesorios", tag: "30dB NRR", image: "assets/guantes.png", color: "black" },
    { id: 12, name: "Linea de Vida Doble con Absolvedor", price: 85.00, category: "accesorios", tag: "Ganchos Grandes", image: "assets/arnes.png", color: "blue" }
];

// Current Filter State
let currentFilters = {
    category: 'all',
    color: 'all',
    sort: 'default'
};

// Cart State Manager (LocalStorage)
let cart = JSON.parse(localStorage.getItem('sic_cart')) || [];

function saveCart() {
    localStorage.setItem('sic_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    counts.forEach(el => el.textContent = totalItems);
}

window.addToCart = (id) => {
    const qtyInput = document.getElementById(`qty-${id}`);
    const quantityToAdd = qtyInput ? parseInt(qtyInput.value) : 1;

    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + quantityToAdd;
    } else {
        cart.push({ ...product, quantity: quantityToAdd });
    }

    saveCart();
    updateCartCount();

    if (qtyInput) qtyInput.value = 1;

    // Feedback visual
    const btn = event?.target;
    if (btn && btn.classList.contains('btn')) {
        const originalText = btn.textContent;
        btn.textContent = "¡Añadido!";
        btn.style.background = "#2ECC71";
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = "";
        }, 1000);
    }
};

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckout();
    }
};

// Rendering Logic
function renderShop() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // 1. Filter
    let filtered = products.filter(p => {
        const matchCategory = currentFilters.category === 'all' || p.category === currentFilters.category;
        const matchColor = currentFilters.color === 'all' || p.color === currentFilters.color;
        return matchCategory && matchColor;
    });

    // 2. Sort
    if (currentFilters.sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentFilters.sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 1.2rem; color: #666; margin-bottom: 10px;">No se encontraron productos.</p>
                <small style="color: #999;">Intenta cambiar los filtros seleccionados.</small>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-image-container">
                <span class="product-tag">${p.tag}</span>
                <img src="${p.image}" alt="${p.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">$${p.price.toFixed(2)}</div>
                <div class="qty-selector">
                    <label>Cantidad:</label>
                    <input type="number" id="qty-${p.id}" value="1" min="1" class="qty-input">
                </div>
                <button class="btn btn-primary btn-block" onclick="addToCart(${p.id})">Añadir al Carrito</button>
            </div>
        </div>
    `).join('');
}

function renderCheckout() {
    const list = document.getElementById('checkout-cart-list');
    const totalEl = document.getElementById('checkout-total-val');
    if (!list || !totalEl) return;

    if (cart.length === 0) {
        list.innerHTML = "<p style='text-align:center; padding: 20px;'>Tu carrito está vacío.</p>";
        totalEl.textContent = "$0.00";
        return;
    }

    list.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div style="display:flex; align-items:center; gap:15px;">
                <img src="${item.image}" style="width:50px; height:50px; object-fit:contain;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Cantidad: ${item.quantity}</small>
                </div>
            </div>
            <div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:red; cursor:pointer; margin-left:10px;">&times;</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Initializers
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Shop Page setup
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        renderShop();

        const catSelect = document.getElementById('cat-select');
        const colorSelect = document.getElementById('color-select');
        const sortSelect = document.getElementById('sort-select');

        if (catSelect) {
            catSelect.addEventListener('change', (e) => {
                currentFilters.category = e.target.value;
                renderShop();
            });
        }

        if (colorSelect) {
            colorSelect.addEventListener('change', (e) => {
                currentFilters.color = e.target.value;
                renderShop();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                currentFilters.sort = e.target.value;
                renderShop();
            });
        }
    }

    // Checkout Page setup
    if (document.getElementById('checkout-cart-list')) {
        renderCheckout();

        const methodOptions = document.querySelectorAll('input[name="pay-method"]');
        methodOptions.forEach(opt => {
            opt.addEventListener('change', (e) => {
                const method = e.target.value;
                document.querySelectorAll('.method-content').forEach(content => {
                    content.classList.remove('active');
                });
                const targetMethod = document.getElementById(`method-${method}`);
                if (targetMethod) targetMethod.classList.add('active');
            });
        });

        const paymentForm = document.getElementById('final-payment-form');
        if (paymentForm) {
            paymentForm.onsubmit = (e) => {
                e.preventDefault();
                alert("¡Pago Procesado Exitosamente! Recibirás un correo con el resumen de tu pedido.");
                cart = [];
                saveCart();
                window.location.href = 'index.html';
            };
        }
    }
});
