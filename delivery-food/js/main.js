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
 cardsMenu = document.querySelector('.cards-menu'),
 menuHeading = document.querySelector('.menu-heading'),
 inputSearch = document.querySelector('.input-search'),
 modalBody = document.querySelector('.modal-body'),
 modalPrice = document.querySelector('.modal-pricetag'),
 clearCart = document.querySelector('.clear-cart');

const cart = localStorage.getItem('cart') === null ? [] : JSON.parse(localStorage.getItem('cart'));
let login = localStorage.getItem('login');

const valid = (str) => {
  const rule = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}/;
  return rule.test(str);
}
const getData = async (url) => {
  const response = await fetch(url);
  if (response.ok){
    return await response.json();
  } else {
    throw new Error(`Ошибка по адресу ${url}, статус ошибка ${response.status}`);
  }
}

function toggleModal() {
  modal.classList.toggle("is-open");
  renderCart();
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
    cartButton.style.display = '';
    checkAuth();
    buttonOut.removeEventListener('click', logOut);
  }
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'flex';
  userName.style.display = 'inline';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
  
}

function notAuthorized(){
  function logIn(event){
    
    event.preventDefault();
    if (!valid(loginInput.value)) {
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

function createCardRestaurant(restaurant){
    const {image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery} = restaurant;
    const card = document.createElement('a');
    card.className = 'card card-restaurant wow bounceInUp';
    card.setAttribute('data-wow-duration', '2s');
    card.products = products;
    card.info = [name, stars, price, kitchen];
    
    card.insertAdjacentHTML('beforeend', `
        <img src= "${image}" alt="${name}" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>`);
    cardsRestaurants.insertAdjacentElement("beforeend", card);
}

function openGoods(event){
  if (login) { // проверка авторизации
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');
    if (restaurant){
      cardsMenu.textContent = '';
      menuHeading.textContent = '';
      menu.classList.remove('hide');
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      createTitleForGoods(restaurant.info);
      getData(`db/${restaurant.products}`).then((data) => data.forEach(createCardGood));
    } 
  }
  else toggleModalAuth();
}

function createCardGood(product){
    const {description, id, image, name, price} = product;
    const card = document.createElement('div');
    card.className = 'card wow bounceInUp';
    card.id = id;
    card.setAttribute('data-wow-duration', '2s');
    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
          </div>
          <div class="card-info">
            <div class="ingredients">${description}
            </div>
          </div>
          <div class="card-buttons">
            <button class="button button-primary button-add-cart">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price card-price-bold">${price} ₽</strong>
          </div>
        </div>`);
    cardsMenu.insertAdjacentElement('beforeend', card);
}

function createTitleForGoods([name, stars, price, kitchen]){
  
  const title = `
    <h2 class="section-title restaurant-title">${name}</h2>
    <div class="card-info">
      <div class="rating">
        ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>`;
  menuHeading.insertAdjacentHTML('beforeend', title);
}

function search(event){
  
  if (event.keyCode === 13) {
    const target = event.target;
    const value = target.value.toLowerCase().trim();
    target.value = '';
    if (!login) { 
      toggleModalAuth();
      return;
    }
    if (!value || value.length < 2) {
      target.style.borderColor = 'red';
      setTimeout(() => target.style.borderColor = '', 2000);
      return;
    }
    cardsMenu.textContent = '';
    menu.classList.remove('hide');
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menuHeading.textContent = '';
    menuHeading.insertAdjacentHTML('beforeend', '<h2 class="section-title restaurant-title">Результаты поиска</h2>');
    getData("db/partners.json")
      .then((data) => {
        const products = data.map((item)=>item.products);
        products.forEach((product) =>
          getData(`db/${product}`)
          .then((data) => data.filter((item) => item.name.toLowerCase().includes(value)))
          .then((data) => data.forEach(createCardGood))
        );
      })
  }
}

function addToCart(event){
  const target = event.target;
  const button = target.closest('.button-add-cart');
  if (button){
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const price = card.querySelector('.card-price').textContent;
    const id = card.id;
    const good = cart.find((item) => item.id == id);
    if (good) good.count += 1;
    else cart.push({id, title, price, count:1});
  }
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(({price, title, count, id}) => {
    const itemCart = `
      <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${price}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id=${id}>-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id=${id}>+</button>
      </div>
      </div>`;
    modalBody.insertAdjacentHTML('beforeend', itemCart);
  });
  const overall = cart.reduce((sum, current) => sum + (parseFloat(current.price) * current.count), 0);
  modalPrice.textContent = overall + ' ₽';
  localStorage.setItem('cart', JSON.stringify(cart));
}
function countChange(event) {
  const target = event.target;
  if (target.classList.contains('counter-button')) {
    const good = cart.find((item) => item.id === target.dataset.id);
    if (target.classList.contains('counter-minus')) {
      good.count--;
      if (good.count === 0) cart.splice(cart.indexOf(good), 1);
    }
    if (target.classList.contains('counter-plus')) good.count++;
    renderCart();
  }
}

function init(){
  getData("db/partners.json").then((data) => data.forEach(createCardRestaurant));

  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function(){
    menu.classList.add('hide');
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
  });
  inputSearch.addEventListener('keydown', search);
  cardsMenu.addEventListener('click', addToCart);
  modalBody.addEventListener('click', countChange);
  clearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  });
  checkAuth();
  new Swiper ('.swiper-container',{
    loop:true,
    autoplay:{
      delay: 5000,
      disableOnInteraction: false,
    },
  });
  new WOW().init();
}
init();