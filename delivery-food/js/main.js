const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

// day 1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const buttonOut = document.querySelector('.button-out');
const userName = document.querySelector('.user-name');
let login = localStorage.getItem('login');

function toggleModalAuth(){
  modalAuth.classList.toggle('is-open');
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
    } else loginInput.style.borderColor = '';
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
checkAuth();

