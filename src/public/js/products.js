const comprar = async (pid) => {
    try {
        const cid = "663abad4c100e248d80f3373";
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