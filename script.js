document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-items tbody');
    const subtotalElement = document.querySelector('.cart-totals .totals span');
    const totalPriceElement = document.querySelector('.cart-totals .total-price');
    const checkoutButton = document.querySelector('.checkout-btn');
    
    async function fetchCartData() {
        try {
            const response = await fetch('cart-item.json'); 
            const data = await response.json();
            renderCartItems(data.items); 
            updateCartTotals(data.items_subtotal_price); 
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    function renderCartItems(cartItems) {
        cartContainer.innerHTML = ''; 
        cartItems.forEach(item => {
            const row = document.createElement('tr');
            const subtotal = item.final_price * item.quantity; 
            row.innerHTML = `
                <td class="product">
                    <img src="${item.image}" alt="${item.product_title}" />
                    <span>${item.product_title}</span>
                </td>
                <td>${formatCurrency(item.final_price)}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="quantity-input">
                </td>
                <td>${formatCurrency(subtotal)}</td>
                <td>
                    <button class="remove-item" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            cartContainer.appendChild(row);
        });
    }

    // Update cart totals
    function updateCartTotals(subtotal) {
        subtotalElement.textContent = formatCurrency(subtotal); 
        totalPriceElement.textContent = formatCurrency(subtotal); 
    }

    // Format currency as Indian Rupees
    function formatCurrency(amount) {
        return '₹ ' + amount.toLocaleString('en-IN');
    }

    // Update quantity
    cartContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const quantity = parseInt(e.target.value);
            const productId = e.target.dataset.id;
            updateCartQuantity(productId, quantity);
        }
    });

    // Remove item from cart
    cartContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-item')) {
            const productId = e.target.closest('.remove-item').dataset.id;
            removeFromCart(productId);
        }
    });

    async function updateCartQuantity(id, quantity) {
        try {
            const response = await fetch(`YOUR_CART_UPDATE_API_URL/${id}`, {
                method: 'POST',
                body: JSON.stringify({ quantity }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            renderCartItems(data.items); 
            updateCartTotals(data.items_subtotal_price);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    async function removeFromCart(id) {
        try {
            const response = await fetch(`YOUR_CART_REMOVE_API_URL/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            renderCartItems(data.items); 
            updateCartTotals(data.items_subtotal_price); 
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    checkoutButton.addEventListener('click', () => {
        window.location.href = '/checkout';
    });

    fetchCartData();
});
