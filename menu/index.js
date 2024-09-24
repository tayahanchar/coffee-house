// burger menu //

const burgerIcon = document.querySelector('.burger-menu');
const modalWindow = document.querySelector('.modal-window');

burgerIcon.addEventListener('click', toggleBurgerMenu);
modalWindow.addEventListener('click', closeBurgerMenu);

function toggleBurgerMenu() {
    burgerIcon.children[0].classList.toggle('burger-menu__line1');
    burgerIcon.children[1].classList.toggle('burger-menu__line2');
    document.body.classList.toggle('body-overflow');

    if(modalWindow.classList.contains('modal-window-open')) {
      modalWindow.classList.toggle('modal-window-open');

      setTimeout(() => {
        modalWindow.style.display = 'none';
      }, 500)
    } else {
      modalWindow.style.display = 'flex';

      setTimeout(() => {
        modalWindow.classList.toggle('modal-window-open');
      }, 100)
    }
}

function closeBurgerMenu(event) {
  if(event.target.closest('.item-overflow') || event.target.closest('.modal-window__menu-link')) {
    burgerIcon.children[0].classList.remove('burger-menu__line1');
    burgerIcon.children[1].classList.remove('burger-menu__line2');
    document.body.classList.remove('body-overflow');

    modalWindow.classList.remove('modal-window-open');

    setTimeout(() => {
      modalWindow.style.display = 'none';
    }, 500)
  }
}

window.addEventListener('resize', (event) => {
  if(event.target.innerWidth > 768 && modalWindow.classList.contains('modal-window-open')) {
    burgerIcon.children[0].classList.remove('burger-menu__line1');
    burgerIcon.children[1].classList.remove('burger-menu__line2');
    document.body.classList.remove('body-overflow');

    modalWindow.classList.remove('modal-window-open');

    setTimeout(() => {
      modalWindow.style.display = 'none';
    }, 1000)
  }
});

// Categories of products //

let currentCategory = 'coffee';
const categoryButtonsWrapper = document.querySelector('.menu__controls');
const cardsWrapper = document.querySelector('.menu__list');
const refreshButton = document.querySelector('.refresh');
categoryButtonsWrapper.addEventListener('click', changeCaregory);
let restProducts;
let filteredProductsList;

showNewProductCards(currentCategory);



function changeCaregory(event) {
  if(event.target.closest('.controls__button')) {
    const newCategory = event.target.closest('.controls__button').dataset.category;

    if(newCategory  === currentCategory) return;

    document.querySelector(`[data-category="${currentCategory}"]`).classList.remove('controls__button-active');
    document.querySelector(`[data-category="${newCategory}"]`).classList.add('controls__button-active');

    currentCategory = newCategory;

    cardsWrapper.innerHTML = '';
    refreshButton.classList.remove('refresh-visible');
    refreshButton.removeEventListener('click',showRestProducts);
    restProducts = null;
    showNewProductCards(currentCategory);
  }
}

async function showNewProductCards(category) {
  const currentCategoryProductsList = await getCurrentFiltereredProductsList(category);

  if(window.innerWidth <= 768 && currentCategoryProductsList.length > 4) {
    createNewProductCards(currentCategoryProductsList.slice(0, 4));
    refreshButton.classList.add('refresh-visible');

    refreshButton.addEventListener('click',showRestProducts);

    restProducts = currentCategoryProductsList.slice(4);

  } else {
    createNewProductCards(currentCategoryProductsList);
  }
}

function showRestProducts() {
  createNewProductCards(restProducts);

  refreshButton.classList.remove('refresh-visible');
}

async function getCurrentFiltereredProductsList(category) {
  const productsList = await getProdutcsList();
  const currentCategoryProductsList = filterProducts(category, productsList);
  filteredProductsList = currentCategoryProductsList;
  return currentCategoryProductsList;
}

async function getProdutcsList() {
  let response = await fetch('../products.json');
  let products = await response.json();
  return products;
}

function filterProducts(category, list) {
  return list.filter(item => item.category === category);
}

function createNewProductCards(list) {
  list.forEach(item => {
    const html = `
    <li class="menu__item" data-id="${item.id}">
          <div class="menu-img__wrap">
            <img class="menu-item__img" src="${item.src}" alt="${currentCategory}">
          </div>

          <div class="menu-item__content">
              <h3 class="menu-item__title">${item.name}</h3>
              <p class="menu-item__text">${item.description}</p>
              <span class="menu-item__price">$${item.price}</span>
          </div>
        </li>
    `;

    cardsWrapper.insertAdjacentHTML('beforeend', html);
  })
}

window.addEventListener('resize', (event) => {
  if(event.target.innerWidth <= 768) {
    cardsWrapper.innerHTML = '';
    refreshButton.removeEventListener('click',showRestProducts);

    createNewProductCards(filteredProductsList.slice(0, 4));
    
    if(filteredProductsList.length > 4) {
      restProducts = filteredProductsList.slice(4);
      refreshButton.classList.add('refresh-visible');
      refreshButton.addEventListener('click',showRestProducts);
    }

  } else {
    refreshButton.removeEventListener('click',showRestProducts);
    refreshButton.classList.remove('refresh-visible');
    cardsWrapper.innerHTML = '';
    createNewProductCards(filteredProductsList);
  }
});

// The Modal //

cardsWrapper.addEventListener('click', openModalWindow);
let itemPrice = 0;

function openModalWindow(event) {
  if(event.target.closest('.menu__item')) {
    const item = filteredProductsList.find(item => item.id === event.target.closest('.menu__item').dataset.id)
    createModalWindow(item);
  }
}

function createModalWindow(item) {
  itemPrice = Number(item.price);

  const modalHTML = `
  <div class="modal">
    <div class="modal-product">
      <img class="product-img" src="${item.src}" alt="${currentCategory}">

      <div class="product__content">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="size">
            <div class="size-title">Size</div>
            <div class="product__buttons size-buttons">
              <button data-size="s" data-price="${item.sizes.s['add-price']}" class="product__add-button active-add-button">
                <p>S</p>
                <span>${item.sizes.s.size}</span>
              </button>
              <button data-size="m" data-price="${item.sizes.m['add-price']}" class="product__add-button">
                <p>M</p>
                <span>${item.sizes.m.size}</span>
              </button>
              <button data-size="l" data-price="${item.sizes.l['add-price']}" class="product__add-button">
                <p>L</p>
                <span>${item.sizes.l.size}</span>
              </button>
            </div>
          </div>

          <div class="additives">
            <div class="additives-title">Additives</div>
            <div class="product__buttons additives-buttons">
              <button data-adds="${item.additives[0]['add-price']}" class="product__add-button">
                <p>1</p>
                <span>${item.additives[0].name}</span>
              </button>
              <button data-adds="${item.additives[0]['add-price']}" class="product__add-button">
                <p>2</p>
                <span>${item.additives[1].name}</span>
              </button>
              <button data-adds="${item.additives[0]['add-price']}" class="product__add-button">
                <p>3</p>
                <span>${item.additives[2].name}</span>
              </button>
            </div>
          </div>

          <div class="total">
            <p>Total:</p>
            <span class="total-price">$${item.price}</span>
          </div>

          <div class="product-inf">
            <div>i</div>
            <p>The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
          </div>

          <button class="product-close">Close</button>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', modalHTML);
  document.body.style.overflow = 'hidden';

  document.querySelector('.modal').addEventListener('click', closeModalWindow);
  document.querySelector('.product-close').addEventListener('click', closeModalWindow);


  document.querySelector('.size-buttons').addEventListener('click', changeItemSize);
  document.querySelector('.additives-buttons').addEventListener('click', changeItemAdditives);
}

function closeModalWindow(event) {
  if(event.target.classList.contains('product-close') || event.target.classList.contains('modal')) {
    document.querySelector('.modal').removeEventListener('click', closeModalWindow);
    document.querySelector('.product-close').removeEventListener('click', closeModalWindow);
    document.querySelector('.size-buttons').removeEventListener('click', changeItemSize);
    document.querySelector('.additives-buttons').removeEventListener('click', changeItemAdditives);
    document.querySelector('.modal').remove();
    document.body.style.overflow = 'auto';
    itemPrice = 0;
  }
}

function changeItemSize (e) {
  if(e.target.closest('.product__add-button')) {
    if(e.target.closest('.product__add-button').dataset.size === document.querySelector('.active-add-button').dataset.size) return;

    itemPrice -= Number(document.querySelector('.active-add-button').dataset.price);
    document.querySelector('.active-add-button').classList.remove('active-add-button');
    e.target.closest('.product__add-button').classList.add('active-add-button');

    itemPrice += Number(e.target.closest('.product__add-button').dataset.price);
    document.querySelector('.total-price').textContent = `$${itemPrice.toFixed(2)}`;
  }
}

function changeItemAdditives(e) {
  if(e.target.closest('.product__add-button')) {
    if(e.target.closest('.product__add-button').classList.contains('active-add-button-adds')) {
      itemPrice -= Number(e.target.closest('.product__add-button').dataset.adds);
      e.target.closest('.product__add-button').classList.remove('active-add-button-adds');
    } else {
      itemPrice += Number(e.target.closest('.product__add-button').dataset.adds);
      e.target.closest('.product__add-button').classList.add('active-add-button-adds');
    }

  
    document.querySelector('.total-price').textContent = `$${itemPrice.toFixed(2)}`;
  }
}