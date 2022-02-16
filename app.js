"use strict";

const IDBRequest = indexedDB.open("DataBase", 1);

IDBRequest.addEventListener("upgradeneeded", ()=>{
    const db = IDBRequest.result;
    db.createObjectStore("names", {
        autoIncrement: true // Se puede usar con KeyPath en lugar de autoIncrement
    });
});

IDBRequest.addEventListener("success", ()=>{
    console.log("todo salió correctamente");
});

IDBRequest.addEventListener("error", ()=>{
    console.log("ocurrió un error al abrir la base de datos");
});


// Para agregar objetos a la base de datos
const addObject = object => {
    const IDBData = getIDBData("readwrite", "objeto agregado correctamente");
    IDBData.add(object);
}

// Para leer objetos a la base de datos
const readObjects = () => {
    const IDBData = getIDBData("readonly");
    const cursor = IDBData.openCursor();
    cursor.addEventListener("success", ()=>{
        if (cursor.result){
            console.log(cursor.result.value);
            cursor.result.continue();
        }
        else {
            console.log("todos los datos han sido leídos");
        }
    });
}

// Para modificar objetos a la base de datos
const modifyObject = (key, object) => {
    const IDBData = getIDBData("readwrite", "objeto modificado correctamente");
    IDBData.put(object, key);
}

const deleteObject = key => {
    const IDBData = getIDBData("readwrite","objeto eliminado correctamente");
    IDBData.delete(key);
}

const getIDBData = (mode, msg) => {
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction("names", mode);
    const objectStore = IDBtransaction.objectStore("names");
    IDBtransaction.addEventListener("complete", ()=>{
        console.log(msg);
    });
    return objectStore;
}

const nameHTML = (nameElement) => {
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
    
    return name;
}

const names = document.querySelector(".names");

names.appendChild(nameHTML("Cristian"));
names.appendChild(nameHTML("Cristian"));
