exports.htmlP = (pass) =>{
    return `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <div class="d-flex flex-column bd-highlight mb-3 justify-content-center align-items-center">
        <div class="p-2 bd-highlight">
            <img src="https://i.ibb.co/Hh0RxKB/pharmadev.png" alt="pharmadev" border="0">
        </div>
        <div class="p-2 bd-highlight " style="color: #393E46;">
            <h1>Recuperación de contraseña</h1>
        </div>
        <div class="p-2 bd-highlight" style="color: #393E46;">
            <h3>Su nueva contraseña es: ${pass}</h3>
        </div>
    </div>`
}
