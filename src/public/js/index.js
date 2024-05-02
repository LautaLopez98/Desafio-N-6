const socket = io();

socket.on('products', productos =>{
    const container = document.getElementById('products');
    container.innerHTML = '';

    productos.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <span>Precio: $${p.price}</span>
            <span>Código: ${p.code}</span>
            <span>Stock: ${p.stock}</span>
            <span>Categoría: ${p.category}</span>
            <span>Estado: ${p.status}</span>
            <img src="/uploads/${p.thumbnail}" alt="Thumbnail">
        `;
        
        container.appendChild(card);
    });
});

const form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const codigo = document.getElementById('codigo').value;
    const stock = document.getElementById('stock').value;
    const categoria = document.getElementById('categoria').value;
    const thumbnail = document.getElementById('thumbnail').value;

    const producto = {
        title: titulo,
        description: descripcion,
        price: precio,
        code: codigo,
        stock: stock,
        category: categoria,
        thumbnail: thumbnail
    };

    socket.emit('addProduct', producto);
    
    form.reset()
})
        // Escuchar evento 'productDeleted' desde el servidor
        

console.log("Cliente conectado")