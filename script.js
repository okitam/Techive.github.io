// Cart State Management
let cartItems = [];

// Load cart items from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartDisplay();
        if (window.location.pathname.includes('checkout.html')) {
            displayCheckoutItems();
        }
    }
});

// Search functionality
function toggleSearch(event) {
    if (event) {
        event.preventDefault();
    }
    
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const body = document.body;
    
    searchOverlay.classList.toggle('active');
    body.classList.toggle('search-active');
    
    if (searchOverlay.classList.contains('active')) {
        searchInput.focus();
    }
}

// Cart functionality
function toggleCart(event) {
    if (event) {
        event.preventDefault();
    }
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('active');
}

// cart display
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCounter = document.getElementById('cartCounter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    
    if (!cartItemsList) return; // Exit if not on a page with cart display
    
    // counter
    cartCounter.textContent = cartItems.length;
    cartCounter.style.display = cartItems.length === 0 ? 'none' : 'block';
    
    // cart items list
    if (cartItems.length > 0) {
        let total = 0;
        cartItemsList.innerHTML = cartItems.map(item => {
            total += parseFloat(item.price);
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-size">Size: ${item.size}</div>
                        <div class="cart-item-price">₱${parseFloat(item.price).toFixed(2)}</div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}', event)">✕</button>
                </div>
            `;
        }).join('');
        
        cartSubtotal.textContent = `₱${total.toFixed(2)}`;
    } else {
        cartItemsList.innerHTML = '<p>Your cart is empty</p>';
        cartSubtotal.textContent = '₱0.00';
    }
}

// Display items in checkout page
function displayCheckoutItems() {
    const checkoutCartItems = document.getElementById('checkoutCartItems');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    const itemCount = document.getElementById('itemCount');
    
    if (!checkoutCartItems) return;
    
    if (cartItems.length > 0) {
        let total = 0;
        checkoutCartItems.innerHTML = cartItems.map(item => {
            total += parseFloat(item.price);
            return `
                <div class="cart-item">
                    <div class="item-image">
                        <span class="quantity-badge">1</span>
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <span class="cart-item-title">${item.name}</span>
                        <span class="cart-item-variant">${item.size}</span>
                    </div>
                    <span class="cart-item-price">₱${parseFloat(item.price).toFixed(2)}</span>
                </div>
            `;
        }).join('');
        
        subtotalAmount.textContent = `₱${total.toFixed(2)}`;
        totalAmount.textContent = `₱${total.toFixed(2)}`;
        itemCount.textContent = cartItems.length;
    } else {
        checkoutCartItems.innerHTML = '<p>Your cart is empty</p>';
        subtotalAmount.textContent = '₱0.00';
        totalAmount.textContent = '₱0.00';
        itemCount.textContent = '0';
    }
}

// Add item to cart
function addItemToCart(item) {
    cartItems.push({
        id: Date.now().toString(),
        ...item
    });
    updateCartDisplay();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    showNotification('Item added to cart');
}

// Remove item from cart
function removeFromCart(itemId, event) {
    if (event) {
        event.stopPropagation();
    }
    cartItems = cartItems.filter(item => item.id !== itemId);
    updateCartDisplay();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Navigation
function goToCheckout() {
    window.location.href = 'checkout.html';
}

// Event Listeners
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay && searchOverlay.classList.contains('active')) {
            toggleSearch();
        }
    }
});

document.addEventListener('click', function(event) {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.querySelector('.nav-icons .fa-search');
    
    if (searchOverlay && searchOverlay.classList.contains('active') && 
        !searchInput.contains(event.target) && 
        !searchIcon.contains(event.target) &&
        !event.target.closest('.close-search')) {
        toggleSearch();
    }
    
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartModal && !cartModal.contains(event.target) && 
        !cartIcon.contains(event.target) && 
        !event.target.closest('.remove-item')) {
        cartModal.classList.remove('active');
    }
});


// Handle profile icon click
function goToAccount() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        window.location.href = 'account.html';
    } else {
        window.location.href = 'index.html'; 
    }
}

// Load user data in account page
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userAddress').textContent = userData.address || 'No address added';
    } else {
        window.location.href = 'index.html'; // Redirect if not logged in
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('cartItems');
    cartItems = [];
    window.location.href = 'index.html';
}
function goToAccount() {
    window.location.href = 'account.html';
}

// Load user data in account page
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'index.html'; // Redirect to login if not logged in
        return;
    }
    displayUserData(userData);
}

// Display user data (account page uses inputs, so set .value)
function displayUserData(userData) {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userPhoneElement = document.getElementById('userPhone');
    const userAddressElement = document.getElementById('userAddress');
    
    if (userNameElement) userNameElement.value = userData.name || '';
    if (userEmailElement) userEmailElement.value = userData.email || '';
    if (userPhoneElement) userPhoneElement.value = userData.phone || '';
    if (userAddressElement) userAddressElement.value = userData.address || '';
}

// Logout function
function logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('cartItems');
    cartItems = [];
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartDisplay();
        if (window.location.pathname.includes('checkout.html')) {
            displayCheckoutItems();
        }
    }
    
    //load user data if on account page
    if (window.location.pathname.includes('account.html')) {
        loadUserData();
    }
});

// Image Gallery
function changeImage(thumbnail) {
    // Update main image
    document.getElementById('mainImage').src = thumbnail.src;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

// Size Selection
document.querySelectorAll('.size-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
    });
});

// Accordion
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        header.classList.toggle('expanded');
    });
});

document.querySelectorAll('.accordion-btn').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling; 
        content.classList.toggle('active'); 
        const isActive = content.classList.contains('active');
        button.querySelector('span').textContent = isActive ? '-' : '+';
    });
});
// Add item to cart
function addItemToCart(item) {
    cartItems.push({
        id: Date.now().toString(),
        ...item
    });
    updateCartDisplay();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    showNotification('Item added to cart');
}
// Add event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const productCard = event.target.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.price').textContent.replace('₱', '').replace(',', '');
        const productImage = productCard.querySelector('img').src;

        const item = {
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            size: 'N/A' 
        };

        addItemToCart(item);
    });
});

// to filter products based on search input
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const brandName = card.querySelector('.brand').textContent.toLowerCase();
        
        if (productName.includes(searchInput) || brandName.includes(searchInput)) {
            card.style.display = ''; // Show the card
        } else {
            card.style.display = 'none'; // Hide the card
        }
    });
}

function showShippingImage() {
    const shippingImageContainer = document.getElementById('shippingImageContainer');
    shippingImageContainer.style.display = 'block'; 
}
