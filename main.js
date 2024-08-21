//variables
const idNumber = document.getElementById("id")
const nombre = document.getElementById("nombrePaciente")
const propietario = document.getElementById("nombrePropietario")
const email = document.getElementById("email")
const fecha = document.getElementById("fecha")
const sintomas = document.getElementById("sintomas")
const submit = document.getElementById("submit")
const formulario = document.querySelector(".formulario")
const contenedorFormulario = document.querySelector(".contenedorFormulario")
const cardPacientes = document.getElementById("cardPacientes")

let alertaBorrando = false
let flag = false

document.addEventListener("DOMContentLoaded", () => {
    const paciente = {
        id:Date.now(),
        nombre:"",
        propietario:"",
        email:"",
        fecha:"",
        sintomas:""
    }

    const objAux = {
        id:Date.now(),
        nombre:"",
        propietario:"",
        email:"",
        fecha:"",
        sintomas:""
    }

    let listaPacientes = []

    //Eventos
    nombre.addEventListener("blur", agregarDatos)
    propietario.addEventListener("blur", agregarDatos)
    email.addEventListener("blur", agregarDatos)
    fecha.addEventListener("blur", agregarDatos)
    sintomas.addEventListener("blur", agregarDatos)
    submit.addEventListener("click", (e)=>{
        e.preventDefault()
        if(submit.textContent === "REGISTRAR PACIENTE"){
            enviarDatos(paciente)
        }else{
            objAux.id = idNumber.value
            objAux.nombre = nombre.value
            objAux.propietario = propietario.value
            objAux.email = email.value
            objAux.fecha = fecha.value
            objAux.sintomas = sintomas.value
            enviarDatos(objAux)
            submit.textContent="REGISTRAR PACIENTE"
        }
    })

    //Funciones
    if(listaPacientes.length === 0){
        cardPacientes.innerHTML = `
        <div class= "sinPacientes">
            <p>No tienes pacientes registrados.</p>
        </div>
        `
    }
    function enviarDatos(objeto){
        submit.textContent = "REGISTRAR PACIENTE"
            if (Object.values(objeto).every(value => value !== "")) {
                if(flag && !alertaBorrando){
                    const index = listaPacientes.findIndex((elemento) => Number(elemento.id) === Number(objeto.id))
                    listaPacientes.splice(index,1,{...objeto})
                    // listaPacientes.splice(index,0,objAux)
                    flag = false
                }else{
                    agregarListaPacientes({ ...objeto }); // Crear una copia del objeto para evitar mutaciones
                }
                formulario.reset()
                crearCard()
            }else{
                const yaExiste = document.querySelector(".error")
                if(!yaExiste){
                    const error = document.createElement("DIV")
                    error.classList.add("error")
                    error.textContent = "Todos los campos deben estar completos"
                    contenedorFormulario.insertBefore(error,contenedorFormulario.children[1])
                    setTimeout(() => {
                        contenedorFormulario.removeChild(error)
                    }, 3000);
                }
            }
    }

    function agregarDatos(e){
        paciente[e.target.name] = e.target.value.trim()
    }

    function agregarListaPacientes(dato){
        listaPacientes.push(dato)
    }

    function crearCard(){
        cardPacientes.innerHTML=""
        for (const element of listaPacientes) {
            generarID()
            const div = document.createElement("DIV")
            div.classList.add("card")
            div.innerHTML=`
            <div>
                <p> <span class="colorSpan"> ID: </span>
                    <span class="id"> ${element.id} </span> </p>
                <p> <span class="colorSpan"> Paciente: </span>
                    <span class="nombre"> ${element.nombre} </span> </p>
                <p> <span class="colorSpan"> Propietario: </span>
                    <span class="propietario"> ${element.propietario} </class=> </p>
                <p> <span class="colorSpan"> Email: </span>
                    <span class="email"> ${element.email} </span> </p>
                <p> <span class="colorSpan"> Fecha: </span>
                    <span class="fecha"> ${element.fecha} </span> </p>
                <p> <span class="colorSpan"> Sintomas: </span>
                    <span class="sintomas"> ${element.sintomas} </span> </p>
            </div>

            <div class="botonesCard">
                <button class="botonCardEditar" id="${element.id}">Editar</button>
                <button class="botonCardBorrar" id="${element.id}">Borrar</button>
            </div>
            `
            cardPacientes.appendChild(div)
        }

        resetearPaciente()
        resetearObjAux()
        alertaBorrando = false

        const editando = document.querySelectorAll(".botonCardEditar")
        editando.forEach((item) => {
            item.addEventListener("click", editarPaciente)
        })

        const borrando = document.querySelectorAll(".botonCardBorrar")
        borrando.forEach((item) => {
            item.addEventListener("click", borrarPaciente)
        })
    }

    function editarPaciente(e){
        deshabilitarTodosLosBotones()
        flag = true
        submit.textContent = "GUARDAR CAMBIOS"
        const dato = e.target.parentElement.parentElement.children[0]
        const idPaciente = dato.querySelector(".id").textContent.trim()
        const nombrePaciente = dato.querySelector(".nombre").textContent.trim()
        const propietarioPaciente = dato.querySelector(".propietario").textContent.trim()
        const emailPaciente = dato.querySelector(".email").textContent.trim()
        const fechaPaciente = dato.querySelector(".fecha").textContent.trim()
        const sintomasPaciente = dato.querySelector(".sintomas").textContent.trim()

        idNumber.value = idPaciente
        nombre.value = nombrePaciente
        propietario.value = propietarioPaciente
        email.value = emailPaciente
        fecha.value = fechaPaciente
        sintomas.value = sintomasPaciente

        const index = listaPacientes.findIndex((elemento) => Number(elemento.id) == Number(e.target.id))
    }

    function borrarPaciente(e){

            alertaBorrando = true 
            const pacienteBorrado = Number(e.target.id)
            listaPacientes = listaPacientes.filter((elemento) => Number(elemento.id) != pacienteBorrado)
            if(listaPacientes.length === 0){
                cardPacientes.innerHTML = `
                <div class= "sinPacientes">
                    <p>No tienes pacientes registrados.</p>
                </div>
                `
            }else{
                crearCard()
            }
            idNumber.value = ""
            nombre.value = ""
            propietario.value = ""
            email.value = ""
            fecha.value = ""
            sintomas.value = ""
            if(submit.textContent == "GUARDAR CAMBIOS"){
                submit.textContent = "REGISTRAR PACIENTE"
            }
    }

    function resetearPaciente(){
        paciente.nombre= ""
        paciente.propietario=""
        paciente.email=""
        paciente.fecha=""
        paciente.sintomas=""
    }

    function resetearObjAux(){
        objAux.id=""
        objAux.nombre= ""
        objAux.propietario=""
        objAux.email=""
        objAux.fecha=""
        objAux.sintomas=""
    }

    function deshabilitarTodosLosBotones() {
        const botones = document.querySelectorAll(".botonCardEditar");
        botones.forEach((boton) => {
            boton.disabled = true;
            boton.classList.add("deshabilitado")
        });
    }

    function generarID(){
        let id = Date.now()
        paciente.id = id
    }
})