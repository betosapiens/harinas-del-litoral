//import
async function cargarDatos(ruta) {
    const respuesta = await fetch(ruta);
    return respuesta.json();
}

// *** Title Text *** //

const span = document.querySelector("span");

span.addEventListener("input", function() {
    const text = this.innerText;
	this.setAttribute("data-heading", text);
	this.parentElement.setAttribute("data-heading", text);
});


//Load
window.addEventListener("DOMContentLoaded", () => {
    cargarDatos('./recetas.json')
        .then(data => {                    
                displayMenuItems(data);    
                displayMenuButtons(data);               
            })
            .catch(error => {
                console.error(`Hubo un error al cargar los datos: ${error}`);
            });
        });    



const container = document.querySelector('.btn-container');
const sectionCenter = document.querySelector('.section-center-menu');


function displayMenuItems(menuItems) {
    let displayMenu = menuItems.map((item) => {
        let ingredientes = item.ingredients.split('<br>');
        let ingredientesLi = ingredientes.map(ingrediente => {            
            return `<li>${ingrediente.trim().substring(1).trim()}</li>`;
        }).join('');
        return `<article class="menu-item">
        <img src="${item.img}" alt="${item.title}" class="img photo">
        <div class="item-info">
        <header>
        <h5>${item.title}</h5>
        <button class="modal-btn" data-id="${item.id}">
            <img src="./img/recipe-svgrepo-com.svg" alt="Ingredientes" class="item-ingredient">
        </button>
        <div class="modal-overlay">
            <div class="main">
                <div class="card">
                    <button class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                    <picture class="card_image">
                        <img src="${item.img}" alt="${item.title}">
                    </picture>
                    <div class="card_content">
                    <h2 class="card_title">${item.title}</h2>
                    <ul>${ingredientesLi}</ul>
                    <div class="card_text">                        
                        <h4>preparación</h4>
                        <p>${item.preparation}</p>                
                    </div>
                    <a href="${item.url}" class="card-link-video">
                        <img src="./img/video-center.svg" alt="Tutorial">
                    </a> 
                </div>
            </div>
        </div>
            
        </div>                   
        </header>            
        <p class="intem-text">${item.desc}</p>
        </div>       
        </article>
        `;
    });
    displayMenu = displayMenu.join("");
    sectionCenter.innerHTML = displayMenu;
    displayRecipes();      
};

function displayMenuButtons(data) {
    const categories = data.reduce((values, item) => {
        if (!values.includes(item.category)) {
            values.push(item.category);
        }
        return values;
    }, ["todos"]);
    const categoryBtns = categories.map((category) => {
        return `<button type="button" class="btn filter-btn" data-id="${category}">${category}</button>`
    }).join('');
    container.innerHTML = categoryBtns;
    const filterBtns = container.querySelectorAll('.filter-btn');
    
    //Filter
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const category = e.currentTarget.dataset.id;
            const menuCategory = data.filter((menuItem) => {
                if (menuItem.category === category) {
                    return menuItem;
                }
            });
            if (category === "todos") {
                displayMenuItems(data);
            } else {
                displayMenuItems(menuCategory);
            }
        })                
    });
}

// OPEN/CLOSE ingredients
function displayRecipes(){    
    const modalBtn = document.querySelectorAll('.modal-btn');
    const modal = document.querySelectorAll ('.modal-overlay');
    const closeBtn = document.querySelectorAll ('.close-btn');
    
    modalBtn.forEach((e)=> {
        e.addEventListener('click', (e)=> {
            let num = e.currentTarget
            num.nextElementSibling.classList.add('open-modal')           
       })
    })

    closeBtn.forEach((e)=> {
        e.addEventListener('click', (e)=> {
            let num = e.currentTarget
            num.parentElement.parentElement.parentElement.classList.remove('open-modal')           
       })
    })    
}

