let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productos = [];

const listaProductos = document.querySelector(".listaProductos");

fetch("../js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto';
            productoDiv.innerHTML = `
                <img src="${producto.img}" alt="${producto.description}" width="200" height="300">
                <h3>${producto.name}</h3>
                <p class="description">${producto.description}</p>
                <p class="stock">Stock: ${producto.available_quantity}</p>
                <p class="precio">Precio: $${producto.price}</p>
                <button class="agregar-al-carrito" data-id="${producto.id}">Agregar al carrito</button>
            `;
            listaProductos.appendChild(productoDiv);
        });

        document.querySelectorAll('.agregar-al-carrito').forEach(button => {
            button.addEventListener('click', () => {
                const productoId = (button.getAttribute('data-id'));
                agregarAlCarrito(productoId);
            });
        });
    });

const agregarAlCarrito = (productoId) => {
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
    }

    const carritoItem = carrito.find(producto => producto.id === productoId);

    if (carritoItem) {
        carritoItem.quantity += 1;
    } else {
        carrito.push({ ...producto, quantity: 1 });
    }

    guardarCarrito();
    mostrarCarrito();
};

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    const total = carrito.reduce((sum, producto) => sum + producto.price * producto.quantity, 0);
    sessionStorage.setItem('total', total);
}

function mostrarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';

    if (carrito.length === 0) {
        carritoDiv.innerHTML = '<p class="carritoVacio">Tu carrito está vacío.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'carrito-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
        ${carrito.map((producto, index) => `
            <tr>
                <td>${producto.name}</td>
                <td>$${producto.price.toFixed(0)}</td>
                <td>${producto.quantity}</td>
                <td>$${(producto.price * producto.quantity).toFixed(0)}</td>
                <td><button class="eliminar-del-carrito" data-index="${index}">Eliminar</button></td>
            </tr>
        `).join('')}
        </tbody>
    `;
    carritoDiv.appendChild(table);

    const total = carrito.reduce((sum, producto) => sum + producto.price * producto.quantity, 0);
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total';
    totalDiv.innerHTML = `<p>Total: $${total.toFixed(0)}</p>`;
    carritoDiv.appendChild(totalDiv);

    const finalizarCompraButton = document.createElement('button');
    finalizarCompraButton.className = 'boton-finalizar-compra';
    finalizarCompraButton.textContent = 'Finalizar compra';
    finalizarCompraButton.addEventListener('click', finalizarCompra);
    carritoDiv.appendChild(finalizarCompraButton);

    const deleteButtons = document.querySelectorAll('.eliminar-del-carrito');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            eliminarDelCarrito(index);
        });
    });
}

function finalizarCompra() {
    Swal.fire({
        title: "Primer paso completado!",
        text: "Serás redirigido para finalizar la transacción.",
        icon: "success",
        timer: 3500,
        timerProgressBar: true,
    });
}

function eliminarDelCarrito(index) {
    const carritoItem = carrito[index];
    if (carritoItem.quantity > 1) {
        carritoItem.quantity -= 1;
    } else {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    mostrarCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarCarrito();
});
