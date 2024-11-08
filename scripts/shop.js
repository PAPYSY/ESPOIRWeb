// scripts/shop.js
document.addEventListener('DOMContentLoaded', function() {
    // Sample products data - In a real application, this would come from a backend
    const products = [
        {
            id: 1,
            name: "Sac en tissu recyclé ESPOIR",
            price: 2500.00,
            category: "textile",
            image: "BAG.png",
            description: "Sac fait main à partir de tissus recyclés"
        },
        {
            id: 2,
            name: "T-Shirt ESPOIR",
            price: 5000.00,
            category: "textile",
            image: "Tshirts-Espoir.png",
            description: "T-Shirt Espoir pour soutenir notre cause"
        },
        {
            id: 3,
            name: "Tasse ESPOIR",
            price: 3500.0,
            category: "artisanat",
            image: "tasses-Espoir.png",
            description: "unedose d'ESPOIR au reveil pour mieux debuter la journée"
        }
        // Add more products as needed
    ];

    let cart = [];
    let filteredProducts = [...products];

    // Initialize the page
    displayProducts(products);
    setupEventListeners();

    function displayProducts(productsToShow) {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        productsToShow.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="src/${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price.toFixed(2)}fr</div>
                <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                    Ajouter au panier
                </button>
            </div>
        `;
        return card;
    }

    function setupEventListeners() {
        // Filter by category
        document.getElementById('categoryFilter').addEventListener('change', filterProducts);
        
        // Filter by price
        document.getElementById('priceFilter').addEventListener('change', filterProducts);
        
        // Search products
        document.getElementById('searchInput').addEventListener('input', filterProducts);
        
        // Add to cart buttons
        document.getElementById('productsGrid').addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.productId);
                addToCart(productId);
            }
        });

        // Remove from cart buttons
        document.getElementById('cartItems').addEventListener('click', function(e) {
            if (e.target.classList.contains('cart-item-remove')) {
                const productId = parseInt(e.target.dataset.productId);
                removeFromCart(productId);
            }
        });

        // Quantity update buttons
        document.getElementById('cartItems').addEventListener('click', function(e) {
            if (e.target.classList.contains('quantity-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                const action = e.target.dataset.action;
                updateQuantity(productId, action);
            }
        });

        // Checkout button
        document.querySelector('.checkout-btn').addEventListener('click', handleCheckout);

        // Cart toggle for mobile
        const cartPreview = document.getElementById('cartPreview');
        if (window.innerWidth <= 768) {
            createMobileCartToggle(cartPreview);
        }

        // Window resize handler for cart preview
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                if (!document.querySelector('.cart-toggle')) {
                    createMobileCartToggle(cartPreview);
                }
            } else {
                const toggle = document.querySelector('.cart-toggle');
                if (toggle) toggle.remove();
                cartPreview.style.display = 'block';
            }
        });
    }

    function filterProducts() {
        const category = document.getElementById('categoryFilter').value;
        const priceRange = document.getElementById('priceFilter').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        filteredProducts = products.filter(product => {
            // Category filter
            const categoryMatch = category === 'all' || product.category === category;

            // Price filter
            let priceMatch = true;
            if (priceRange !== 'all') {
                const [min, max] = priceRange.split('-').map(Number);
                if (max) {
                    priceMatch = product.price >= min && product.price < max;
                } else {
                    priceMatch = product.price >= min;
                }
            }

            // Search filter
            const searchMatch = product.name.toLowerCase().includes(searchTerm) ||
                              product.description.toLowerCase().includes(searchTerm);

            return categoryMatch && priceMatch && searchMatch;
        });

        displayProducts(filteredProducts);
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.product.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({
                product: product,
                quantity: 1
            });
        }

        updateCartDisplay();
        showNotification('Produit ajouté au panier');
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.product.id !== productId);
        updateCartDisplay();
        showNotification('Produit retiré du panier');
    }

    function updateQuantity(productId, action) {
        const cartItem = cart.find(item => item.product.id === productId);
        if (!cartItem) return;

        if (action === 'increase') {
            cartItem.quantity++;
        } else if (action === 'decrease') {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
            } else {
                removeFromCart(productId);
                return;
            }
        }

        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.product.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.product.name}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" data-product-id="${item.product.id}" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-product-id="${item.product.id}" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-price">${itemTotal.toFixed(2)}fr</div>
                </div>
                <button class="cart-item-remove" data-product-id="${item.product.id}">×</button>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = `${total.toFixed(2)}fr`;
        updateCartBadge(cart.reduce((sum, item) => sum + item.quantity, 0));
    }

    function createMobileCartToggle(cartPreview) {
        const toggle = document.createElement('button');
        toggle.className = 'cart-toggle btn btn-primary';
        toggle.innerHTML = `
            <span class="cart-badge">0</span>
            <span>Panier</span>
        `;
        
        document.body.appendChild(toggle);
        cartPreview.style.display = 'none';

        toggle.addEventListener('click', () => {
            cartPreview.style.display = cartPreview.style.display === 'none' ? 'block' : 'none';
        });
    }

    function updateCartBadge(quantity) {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = quantity;
            badge.style.display = quantity > 0 ? 'block' : 'none';
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    function handleCheckout() {
        if (cart.length === 0) {
            showNotification('Votre panier est vide');
            return;
        }

        // In a real application, this would handle payment processing
        // For now, we'll just show a success message and clear the cart
        showNotification('Commande validée ! Redirection vers le paiement...');
        setTimeout(() => {
            cart = [];
            updateCartDisplay();
            showNotification('Merci pour votre commande !');
        }, 2000);
    }
});