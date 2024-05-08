// const comprar=async(pid)=>{
//     let inputCarrito=document.getElementById("cart")
//     let cid=inputCarrito.value
//     console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`)

//     let respuesta=await fetch(`/api/carts/${cid}/product/${pid}`,{
//         method:"post"
//     })
//     if(respuesta.status===200){
//         let datos=await respuesta.json()
//         console.log(datos)
//         alert("Producto agregado...!!!")
//     }
// }

function comprar(productoId) {
    const carritoId = document.getElementById('cart').dataset.carritoId;
    fetch(`/api/carts/${carritoId}/product/${productoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cid: carritoId,
            pid: productoId 
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al agregar el producto al carrito');
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}