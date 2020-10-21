

let frm = document.forms[0];
frm.addEventListener('submit', manejadorSubmit);
document.getElementById("btnBorrar").addEventListener('click', eliminarAnuncioLS);
document.getElementById("btnCancelar").addEventListener('click', cancelar);


iniciarListaLS("lista");
actualizarVista();


function iniciarListaLS(nombre) {
    let array = new Array();
    if (localStorage.getItem(nombre) == null) {
        guardarDatosLS(nombre, array);
    }
}


function actualizarVista() {

    document.getElementById("divTabla").innerHTML = "";
    document.getElementById('divTabla').innerHTML =
        '<img src="./img/208.gif" alt="spinner">';

    setTimeout(() => {
        document.getElementById("divTabla").innerHTML = "";
        let datos = leerDatosLS("lista");
        document.getElementById("divTabla").appendChild(crearTabla(datos));
        limpiarValues();


        let tds = document.getElementsByTagName("td");
        for (var i = 0; i < tds.length; i++) {
            let td = tds[i];
            td.addEventListener('click', setValues);
        }

    }, 3000);
}

function manejadorSubmit(e) {
    e.preventDefault();
    let nuevoAnuncio = obtenerAnuncio(e.target, false);
    let lista = leerDatosLS("lista");

    lista.push(nuevoAnuncio);
    borrarAlgoLS("lista");
    guardarDatosLS("lista", lista);
    actualizarVista();

}

function manejadorModificar(e) {
    e.preventDefault();
    let anuncio = obtenerAnuncio(e.target, true);
    modificarAnuncioLS(anuncio);
}

function modificarAnuncioLS(anuncio) {

    if (window.confirm("DESEA MODIFICAR ESTE ANUNCIO??")) {
        let lista = leerDatosLS("lista");

        anuncio = obtenerAnuncio(frm, true);

        lista.forEach(element => {
            if (element.id == anuncio.id) {
                element.titulo = anuncio.titulo;
                element.transaccion = anuncio.transaccion;
                element.descripcion = anuncio.descripcion;
                element.precio = anuncio.precio;
                element.num_puertas = anuncio.num_puertas;
                element.num_KMs = anuncio.num_KMs;
                element.potencia = anuncio.potencia;
            }
        });


        borrarAlgoLS("lista");
        guardarDatosLS("lista", lista);
        document.getElementById("btnBorrar").hidden = true;
        document.getElementById("btnCancelar").hidden = true;

        frm.removeEventListener('submit', manejadorModificar);
        frm.addEventListener('submit', manejadorSubmit);
        actualizarVista();

    }

}

function cancelar() {
    document.getElementById("btnBorrar").hidden = true;
    document.getElementById("btnCancelar").hidden = true;
    frm.removeEventListener('submit', manejadorModificar);
    frm.addEventListener('submit', manejadorSubmit);
    actualizarVista();
}

function eliminarAnuncioLS(anuncio) {

    if (window.confirm("DESEA ELIMINAR ESTE ANUNCIO??")) {
        let lista = leerDatosLS("lista");
        let nuevaLista = new Array();
        anuncio = obtenerAnuncio(frm, true);

        lista.forEach(element => {
            if (element.id != anuncio.id) {
                nuevaLista.push(element);
            }
        });


        borrarAlgoLS("lista");
        guardarDatosLS("lista", nuevaLista);

        document.getElementById("btnBorrar").hidden = true;
        document.getElementById("btnCancelar").hidden = true;
        frm.removeEventListener('submit', manejadorModificar);
        frm.addEventListener('submit', manejadorSubmit);
        actualizarVista();

    }

}

function obtenerAnuncio(frm, tieneId) {
    let titulo;
    let transaccion;
    let descripcion;
    let precio;
    let num_puertas;
    let num_KMs;
    let potencia;
    let id = -1;

    for (element of frm.elements) {
        switch (element.name) {
            case "titulo":
                titulo = element.value;
                break;
            case "transaccion":
                transaccion = element.value;
                break;
            case "descripcion":
                descripcion = element.value;
                break;
            case "precio":
                precio = element.value;
                break;
            case "num_puertas":
                num_puertas = element.value;
                break;
            case "num_KMs":
                num_KMs = element.value;
                break;
            case "potencia":
                potencia = element.value;
                break;
            case "idAnuncio":
                if (tieneId == true) {
                    id = element.value;
                } else {
                    id = leerDatosLS("proximoID") || 100;

                    proxID = id + 1;
                    guardarDatosLS("proximoID", proxID);
                }
                break;
        }
    }

    return new Anuncio_Auto(id, titulo, transaccion, descripcion, precio, num_puertas, num_KMs, potencia);
}


function obtenerId(frm) {
    for (element of frm.elements) {
        if (element.name === "idAnuncio") {
            return `id=${element.value}`;
        }
    }
}





function setValues(e) {
    let tr = e.target.parentElement;
    let nodos = tr.childNodes;
    document.getElementById("idAnuncio").value = nodos[0].innerText;
    document.getElementById("idAnuncio").hidden = false;
    document.getElementById("lblId").hidden = false;
    document.getElementById("txtTitulo").value = nodos[1].innerText;
    document.getElementById("txtDescripcion").value = nodos[3].innerText;
    document.getElementById("numPrecio").value = nodos[4].innerText;
    document.getElementById("kms").value = nodos[6].innerText;
    document.getElementById("txtPotencia").value = nodos[7].innerText;
    document.getElementById("txtTransaccion").value = nodos[2].innerText;
    document.getElementById("txtPuertas").value = nodos[5].innerText;
    document.getElementById("btnBorrar").hidden = false;
    document.getElementById("btnCancelar").hidden = false;
    frm.removeEventListener('submit', manejadorSubmit);
    frm.addEventListener('submit', manejadorModificar);

}

function limpiarValues() {
    document.getElementById("idAnuncio").value = "";
    document.getElementById("idAnuncio").hidden = true;
    document.getElementById("lblId").hidden = true;
    document.getElementById("txtTitulo").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("numPrecio").value = "";
    document.getElementById("kms").value = "";
    document.getElementById("txtPuertas").value = "";
    document.getElementById("txtPotencia").value = "";
    document.getElementById("txtTransaccion").value = "nada";
    document.getElementById("btnCrearModificar").value = "Crear Anuncio";

}



///////////////////////// CREAR TABLA////////////////////////////////////

function crearTabla(array) {
    let tabla = document.createElement("table");
    let cabecera = document.createElement("tr");


    for (atributo in array[0]) {
        let th = document.createElement("th");
        th.textContent = atributo;
        cabecera.appendChild(th);
    }

    tabla.appendChild(cabecera);

    for (i in array) {
        let fila = document.createElement("tr");
        let objeto = array[i];

        for (j in objeto) {
            let celda = document.createElement("td");
            let dato = document.createTextNode(objeto[j]);
            celda.appendChild(dato);
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    return tabla;
}
//////////////////////LOCAL STORAGE/////////////////////////////////



function leerDatosLS(nombre) {

    return JSON.parse(localStorage.getItem(nombre));
}

function guardarDatosLS(nombre, array) {

    localStorage.setItem(nombre, JSON.stringify(array));
}

function actualizarDatosLS(nombre, array) {

    localStorage.removeItem(nombre);
    guardarDatosLS(nombre, array);
}

function borrarAlgoLS(nombre) {

    localStorage.removeItem(nombre);
}

function borrarTodoLS() {

    localStorage.clear();
}


//////////////////////////////////////////////////////////////////////////////////////
