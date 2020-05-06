'use strict';

const cartButton = document.querySelector("#cart-button"),
 modal = document.querySelector(".modal"),
 close = document.querySelector(".close"),
 buttonAuth = document.querySelector('.button-auth'),
 modalAuth = document.querySelector('.modal-auth'),
 closeAuth = document.querySelector('.close-auth'),
 logInForm = document.querySelector('#logInForm'),
 loginInput = document.querySelector('#login'),
 buttonOut = document.querySelector('.button-out'),
 userName = document.querySelector('.user-name'),
 cardsRestaurants = document.querySelector('.cards-restaurants'),
 containerPromo = document.querySelector('.container-promo'),
 restaurants = document.querySelector('.restaurants'),
 menu = document.querySelector('.menu'),
 logo = document.querySelector('.logo'),
 cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('login');

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth(){
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
}

function authorized(){
  function logOut(){
    login = null;
    localStorage.removeItem('login');
    buttonAuth.style.display = '';
    buttonOut.style.display = '';
    userName.style.display = '';
    checkAuth();
    buttonOut.removeEventListener('click', logOut);
  }
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'block';
  userName.style.display = 'inline';
  buttonOut.addEventListener('click', logOut);
  
}

function notAuthorized(){
  function logIn(event){
    
    event.preventDefault();
    if (loginInput.value === '') {
      loginInput.style.borderColor = 'red';
      return;
    }
    login = loginInput.value;
    localStorage.setItem('login', login);
    toggleModalAuth()
    buttonAuth.removeEventListener('click',toggleModalAuth);
    closeAuth.removeEventListener('click',toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();
    checkAuth();
  }
  buttonAuth.addEventListener('click',toggleModalAuth);
  closeAuth.addEventListener('click',toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth(){
  if (login) {
    authorized();
  }
  else notAuthorized();  
}

function createCardRestaurant(){
  const card = `
    <a class="card card-restaurant">
      <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Пицца плюс</h3>
          <span class="card-tag tag">50 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            4.5
          </div>
          <div class="price">От 900 ₽</div>
          <div class="category">Пицца</div>
        </div>
      </div>
    </a>`;
  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function openGoods(event){
  if (login) { // проверка авторизации
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');
    if (restaurant){
      cardsMenu.textContent = '';
      menu.classList.remove('hide');
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      createCardGood();
      createCardGood();
      createCardGood();
    } 
  }
  else toggleModalAuth();
}

function createCardGood(){
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">Пицца Везувий</h3>
        </div>
        <!-- /.card-heading -->
        <div class="card-info">
          <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
            «Халапенье», соус «Тобаско», томаты.
          </div>
        </div>
        <!-- /.card-info -->
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">545 ₽</strong>
        </div>
      </div>`);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function(){
  menu.classList.add('hide');
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
});

checkAuth();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();
