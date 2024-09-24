// burger menu //

const burgerIcon = document.querySelector('.burger-menu');
const modalWindow = document.querySelector('.modal-window');
const logo = document.querySelector('.logo-link');

burgerIcon.addEventListener('click', toggleBurgerMenu);
modalWindow.addEventListener('click', closeBurgerMenu);
logo.addEventListener('click', () => {
    burgerIcon.children[0].classList.remove('burger-menu__line1');
    burgerIcon.children[1].classList.remove('burger-menu__line2');
    document.body.classList.remove('body-overflow');

    modalWindow.classList.remove('modal-window-open');

    setTimeout(() => {
      modalWindow.style.display = 'none';
    }, 500)
})

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

// the carousel //

let slideNumber = 0;
let sliderWidth = document.documentElement.clientWidth <= 550 ? 348 : 480;
const drinkWrapper = document.querySelector('.drinks');

window.addEventListener('resize', (event) => {
  if(event.target.innerWidth <= 550) {
    sliderWidth = 348;
  } else {
    sliderWidth = 480;
  }

  let slidePosition = sliderWidth * slideNumber;
    drinkWrapper.style.transform = `translate(-${slidePosition}px)`;
});

const coffeeList = [
  {
    name: 'S\’mores Frappuccino',
    description: 'This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.',
    price: '5.50',
    src: './assets/images/frappuccino.png',
  },
  {
    name: 'Caramel Macchiato',
    description: 'Fragrant and unique classic espresso with rich caramel-peanut syrup, with the addition of delicate cream under whipped thick foam.',
    price: '5.00',
    src: './assets/images/macchiato.png',
  },
  {
    name: 'Ice coffee',
    description: 'A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.',
    price: '4.50',
    src: './assets/images/ice.png',
  }
];

function createNewSlide(slide) {
  return `<div class="favorites__drink"><img class="favorites__main-img" src="${coffeeList[slide].src}" alt="coffee">
  <h3 class="drink__title">${coffeeList[slide].name}</h3>
  <p class="drink__description">${coffeeList[slide].description}</p>
  <div class="drink__price">$${coffeeList[slide].price}</div></div>`;
}

function showNewSlid(slide) {
  const newSlide = createNewSlide(slide);
  drinkWrapper.insertAdjacentHTML('beforeend', newSlide);
}

function createSlider() {
  coffeeList.forEach((item, itemId) => showNewSlid(itemId))
}

let sliderRangeInterval;
let sliderTimeOut;
let clearRangeInterval;
let distanceInterval = 20;
createSlider();
showSlideProgress();
showNextSlide();


function showNextSlide() {
  sliderTimeOut = setTimeout(() => {
    if(slideNumber === coffeeList.length - 1) {
      slideNumber = 0;
    } else {
      slideNumber +=1;
    }

    let slidePosition = sliderWidth * slideNumber;
    drinkWrapper.style.transform = `translate(-${slidePosition}px)`;

    showSlideProgress();
    showNextSlide();
  }, 5000)
}

function showSlideProgress() {
  const currentRange = document.querySelector(`[data-range="${slideNumber}"]`);
  currentRange.value = distanceInterval;
  currentRange.style.background = `linear-gradient(to right, var(--dark) 0%, var(--dark) ${distanceInterval}%, var(--border) ${distanceInterval}%, var(--border) 100%)`;
  sliderRangeInterval = setInterval(() => {
    distanceInterval +=20;
    currentRange.value = distanceInterval;
    currentRange.style.background = `linear-gradient(to right, var(--dark) 0%, var(--dark) ${distanceInterval}%, var(--border) ${distanceInterval}%, var(--border) 100%)`;
  }, 1000);

  clearSlideRangeInterval(sliderRangeInterval, currentRange);
}

function clearSlideRangeInterval(int, item) {
  clearRangeInterval = setTimeout(() => {
    clearInterval(int);
    item.style.background = `linear-gradient(to right, var(--dark) 0%, var(--dark) 0%, var(--border) 0%, var(--border) 100%)`;
    distanceInterval = 20;
  }, 5000);
}

const leftButton = document.querySelector('.arrow__left');
const rightButton = document.querySelector('.arrow__right');

leftButton.addEventListener('click', changeSlideLeft);
rightButton.addEventListener('click', changeSlideRight);

function changeSlideLeft() {
  clearInterval(sliderRangeInterval);
  clearTimeout(sliderTimeOut);
  clearTimeout(clearRangeInterval);

  const currentRange = document.querySelector(`[data-range="${slideNumber}"]`);
  currentRange.style.background = `linear-gradient(to right, var(--dark) 0%, var(--dark) 0%, var(--border) 0%, var(--border) 100%)`;

  if (slideNumber === 0) {
    slideNumber = coffeeList.length - 1;
  } else {
    slideNumber -= 1;
  }
  distanceInterval = 20;
  showSlideProgress();
  showSlid();
}

function showSlid() {
  let slidePosition = sliderWidth * slideNumber;
  drinkWrapper.style.transform = `translate(-${slidePosition}px)`;

  showNextSlide();
}

function changeSlideRight() {

  clearInterval(sliderRangeInterval);
  clearTimeout(sliderTimeOut);
  clearTimeout(clearRangeInterval);

  const currentRange = document.querySelector(`[data-range="${slideNumber}"]`);
  currentRange.style.background = `linear-gradient(to right, var(--dark) 0%, var(--dark) 0%, var(--border) 0%, var(--border) 100%)`;

  if (slideNumber === coffeeList.length - 1) {
    slideNumber = 0;
  } else {
    slideNumber += 1;
  }
  distanceInterval = 20;
  showSlideProgress();
  showSlid();
}

drinkWrapper.addEventListener('mouseenter', pouseSliderAnimation);
drinkWrapper.addEventListener('mouseleave', playSliderAnimation);
drinkWrapper.addEventListener('touchstart', pouseSliderAnimation);
drinkWrapper.addEventListener('touchend', playSliderAnimation);


drinkWrapper.addEventListener('contextmenu', playSliderAfterContextMenu);

function playSliderAfterContextMenu(event) {
    if(event.buttons === 0) {
      clearInterval(sliderRangeInterval);
      clearTimeout(sliderTimeOut);
      clearTimeout(clearRangeInterval);

      playSliderAnimation();
  }
}


function pouseSliderAnimation() {
  clearInterval(sliderRangeInterval);
  clearTimeout(sliderTimeOut);
  clearTimeout(clearRangeInterval);
}

function playSliderAnimation() {
  const time = (5 - (distanceInterval / 20)) * 1000 + 1000;

  const currentRange = document.querySelector(`[data-range="${slideNumber}"]`);

    sliderRangeInterval = setInterval(() => {
      distanceInterval +=20;
      currentRange.value = distanceInterval;
      currentRange.style.background = `linear-gradient(to right, var(--dark) 0%, var(--dark) ${distanceInterval}%, var(--border) ${distanceInterval}%, var(--border) 100%)`;
    }, 1000);

    clearRangeInterval = setTimeout(() => {
      clearInterval(sliderRangeInterval);
      currentRange.style.background = `linear-gradient(to right, var(--dark) 0%, var(--dark) 0%, var(--border) 0%, var(--border) 100%)`;
      distanceInterval = 20;
    }, time);

      sliderTimeOut = setTimeout(() => {
        if(slideNumber === coffeeList.length - 1) {
          slideNumber = 0;
        } else {
          slideNumber +=1;
        }
    
        let slidePosition = sliderWidth * slideNumber;
        drinkWrapper.style.transform = `translate(-${slidePosition}px)`;

        showSlideProgress();
        showNextSlide();
      }, time)
}

let touchStartCoordsX = 0;
let touchNewCoordsX = 0;

drinkWrapper.addEventListener('touchstart', (event) => {
  touchStartCoordsX = event.touches[0].clientX;
});
drinkWrapper.addEventListener('touchmove', (event) => {
  touchNewCoordsX = event.touches[0].clientX;
});

drinkWrapper.addEventListener('touchend', changeSlideFromTouch);

function changeSlideFromTouch() {
  
  if (!touchStartCoordsX || !touchNewCoordsX) {
    return;
  }
  
  const XDif = touchStartCoordsX - touchNewCoordsX;
  
  if (Math.abs(XDif) > 100) {
    if (XDif > 0) {
      changeSlideRight();
    } else {
      changeSlideLeft();
    }
  }

  touchStartCoordsX = 0;
  touchNewCoordsX = 0;
}

