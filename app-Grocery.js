const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".grocery-clear-btn");


// Edit option
let editElement;
let editFlag = false;
let editID = "";

// submit form
form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener("click", clearItems);
// load items
window.addEventListener("DOMContentLoaded", setupItems);



//*** FUNCTIONS ***//

function addItem(e) {
    e.preventDefault();
    const value = grocery.value;

    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        createListItem(id,value);       
        //display alert
        displayAlert('item added to the list','success');
        //Show container
        container.classList.add('show-container');
        //add to local storage
        addToLocalStorage(id,value);
        //set back to default
        setBackToDefault();
    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('value changed',"success");
        // edit local storage
        editLocalStorage(editID,value);
        setBackToDefault();
    } else {
        displayAlert("please enter value", "danger");
    }
}

// Display Alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    setTimeout(function () {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000)
}

// Clear items
function clearItems (){
    const items = document.querySelectorAll(".grocery-item");

    if (items.length > 0) {
        items.forEach( item => {
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert('empty list', "danger");
    setBackToDefault();
    localStorage.removeItem('list');
}

// Delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    element.classList.add('deleting');  /*****/
    element.addEventListener('transitionend', function() { /*****/
        list.removeChild(element);
        if (list.children.length === 0) {
            container.classList.remove("show-container")
        }
        displayAlert('item removed', "danger");
        setBackToDefault();
        
        removeFromLocalStorage(id);
    });

}

// Edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit';
}

// Set back to default

function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = ""
    submitBtn.textContent = "submit";
}

//*** LOCAL STORAGE ***//

function addToLocalStorage(id,value) {
    const grocery = { id, value};
    let items = getLocalStorage();
        console.log(grocery);
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id,value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//*** SETUP ITEMS ***//

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0) {
        items.forEach(function(item){
            createListItem(item.id,item.value)
        })
    container.classList.add("show-container")
    }
}

function createListItem(id,value){
    const element = document.createElement("article");
    // add class
    element.classList.add("grocery-item","creating");
    //add id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `
        <span class="title-grocery">${value}</span>
        <div class="btn-container-item">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>        
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
        </div>`;

    
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    //append child
    list.appendChild(element);
    setTimeout(() => element.classList.remove('creating'), 0);
}


//*** Save Llist to TXT ***//

document.getElementById('saveList').addEventListener('click', saveListToTxtFile);

function saveListToTxtFile() {
    
    let items = getLocalStorage();
    
    let listString = '';
    items.forEach(function(item){
        listString += `${item.value}\n`;
    })
    
    let blob = new Blob([listString], {type: "text/plain;charset=utf-8"});
    
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = 'GroceryList.txt';
    
    document.body.appendChild(link);
    
    link.click();
    
    document.body.removeChild(link);
}