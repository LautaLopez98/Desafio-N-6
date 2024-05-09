const comprar = async (pid) => {
    try {
        // Definir el ID del carrito
        const cid = "663abad4c100e248d80f3373"; // Reemplazar "ID_DEL_CARRITO" con el ID del carrito deseado
        
        // Agregar el producto al carrito
        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: "POST"
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            alert("Producto agregado al carrito");
        } else {
            throw new Error("Error al agregar el producto al carrito");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al agregar el producto al carrito");
    }
}

// function comprar(productoId) {
//     const carritoId = document.getElementById('cart').dataset.carritoId;
//     fetch(`/api/carts/${carritoId}/product/${productoId}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             cid: carritoId,
//             pid: productoId 
//         })
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         }
//         throw new Error('Error al agregar el producto al carrito');
//     })
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }