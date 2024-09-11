document.addEventListener('DOMContentLoaded', () => {
    // Cargar menú desde el backend
    fetch('http://localhost:3000/menu')
        .then(response => response.json())
        .then(menuItems => {
            const menuDiv = document.getElementById('menu');
            menuItems.forEach(item => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <p>${item.name}</p>
                    <span>$${item.price.toFixed(2)}</span>
                    <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Agregar</button>
                `;
                menuDiv.appendChild(productDiv);
            });
        });

    // Cargar categorías desde el backend
    fetch('http://localhost:3000/categorias')
        .then(response => response.json())
        .then(categories => {
            const categoriesDiv = document.getElementById('categories');
            categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('category');
                categoryDiv.innerHTML = `<p>${category.nombre}</p>`;
                categoriesDiv.appendChild(categoryDiv);
            });
        });

    // Función para añadir productos al carrito
    window.addToCart = function(id, name, price) {
        cart.push({ id, name, price, quantity: 1 }); // Suponiendo que la cantidad es 1 por defecto
        total += price;
        updateCartUI();
    };

    // Actualizar la UI del carrito
    function updateCartUI() {
        const cartItems = document.getElementById('cart-items');
        const totalElement = document.getElementById('total');
        cartItems.innerHTML = '';
        cart.forEach(item => {
            let li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
            cartItems.appendChild(li);
        });
        totalElement.textContent = total.toFixed(2);
    }

    // Manejar el pago
    document.getElementById('checkout-btn').addEventListener('click', () => {
        fetch('http://localhost:3000/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart, total })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            cart = [];
            total = 0;
            updateCartUI();
        });
    });
});