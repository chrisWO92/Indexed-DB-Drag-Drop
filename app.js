"use strict";

/************************ CREACIÓN DE DATABASE Y ASIGNACIÓN DE EVENTOS ************************/

// Creación de la DataBase con IndexedDB

const IDBRequest = indexedDB.open("DataBase", 1);

// Función para el evento de agregar datos. Se asigna {autoincrement: true} para hacer
// que cada nuevo registro tenga un id único e irrepetible
IDBRequest.addEventListener("upgradeneeded", ()=>{
    const db = IDBRequest.result;
    db.createObjectStore("names", {
        autoIncrement: true // Se puede usar con KeyPath en lugar de autoIncrement
    });
});

// Función para el evento "success" que es el que indica que la DataBase ha sido accedida con 
// éxito. La función readObjects() en su interior cambia dependiendo del proyecto. En este caso
// cumple la función de leer todos los elementos, creando transacciones internamente del tipo
// "readonly" para leer cada elemento
IDBRequest.addEventListener("success", ()=>{
    readObjects();
});

// Función para el caso de error accedido y/o creando la DataBase
IDBRequest.addEventListener("error", ()=>{
    console.log("ocurrió un error al abrir la base de datos");
});

/*********************************************************************************************/



/********* CREACIÓN DE FUNCIONES Y ASIGNACIÓN DE EVENTOS PARA LÓGICA DE LA APLICACIÓN *********/

// Función que crea una transacción en la base de datos
const getIDBData = (mode, msg) => {
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction("names", mode);
    const objectStore = IDBtransaction.objectStore("names");
    IDBtransaction.addEventListener("complete", ()=>{
        console.log(msg);
    });
    return objectStore;
}

// Función que crea un elemento DIV que contiene el nombre y los botones Save y Delete
// Le asigna funciones al click de dichos botones
const nameHTML = (id, nameElement) => {
    const name = document.createElement("DIV");
    const title = document.createElement("H2");
    const options = document.createElement("DIV");
    const saveButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    saveButton.textContent = "Save";
    deleteButton.textContent = "Delete";
    title.textContent = nameElement;

    name.classList.add("name");
    options.classList.add("options");
    saveButton.classList.add("impossible");
    deleteButton.classList.add("delete");

    options.appendChild(saveButton);
    options.appendChild(deleteButton);

    name.appendChild(title);
    name.appendChild(options);

    title.contentEditable = 'true';
    title.addEventListener("keyup", () => {
        saveButton.classList.replace("impossible","possible");
        document.querySelector(".possible").addEventListener("click", () => {
            modifyObject(id, {name: title.textContent});
            saveButton.classList.replace("possible", "impossible");
        })
    })

    deleteButton.addEventListener("click", () => {
        deleteObject(id);
        readObjects();
    })
    
    return name;
}

// Para agregar objetos a la base de datos
const addObject = object => {
    const IDBData = getIDBData("readwrite", "objeto agregado correctamente");
    IDBData.add(object);
}

// Para leer objetos a la base de datos
const readObjects = () => {
    const IDBData = getIDBData("readonly");
    const cursor = IDBData.openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector(".names").innerHTML = "";
    cursor.addEventListener("success", ()=>{
        if (cursor.result){
            let element = nameHTML(cursor.result.key, cursor.result.value.name);
            fragment.appendChild(element);
            cursor.result.continue();
        }
        else {
            document.querySelector(".names").appendChild(fragment);
        }
    });
}

// Para modificar objetos a la base de datos
const modifyObject = (key, object) => {
    const IDBData = getIDBData("readwrite", "objeto modificado correctamente");
    IDBData.put(object, key);
}


// Para eliminar objetos de la base de datos
const deleteObject = key => {
    const IDBData = getIDBData("readwrite","objeto eliminado correctamente");
    IDBData.delete(key);
}

// Para agregar nuevos elementos a la lista con el botón add
const names = document.querySelector(".names"); // Contenedor de todas las líneas
const nameToAdd = document.getElementById("name"); // Nombre escrito en el input

// Función para el evento click del botón add, que comprueba si hay algún elemento con la clase
// "possible" para advertir al usuario que está intentando agregar un elemento y refrescar la
// página sin guardar elementos editados
document.getElementById("add").addEventListener("click", () =>{

    if (document.querySelectorAll(".impossible").length == 0){
        addObject({name: nameToAdd.value});
        readObjects();
    }else {
        if (document.querySelectorAll(".possible").length !== 0){
            if (confirm("Hay elementos sin guardar, ¿Desea continuar sin guardar?")){
                addObject({name: nameToAdd.value});
                readObjects();
            }
        }else {
            addObject({name: nameToAdd.value});
            readObjects();
        }
    }
    
})

/**********************************************************************************************/