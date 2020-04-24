const generateId = () => `Id${Math.round(Math.random() * 1e8).toString(16)}`;
const
totalBalance = document.querySelector('.total__balance'),
totalMoneyIncome = document.querySelector('.total__money-income'),
totalMoneyExpenses = document.querySelector('.total__money-expenses'),
historyList = document.querySelector('.history__list'),
form = document.querySelector('#form'),
operationName = document.querySelector('.operation__name'),
operationAmount = document.querySelector('.operation__amount');

let dbOperation = JSON.parse(localStorage.getItem('calc_history')) || [];

const renderOperation = (operation) => {
  const className = operation.amount < 0 ? 'history__item-minus' : 'history__item-plus';
  let li = document.createElement('li');
  li.classList.add('history__item');
  li.classList.add(className);
  li.innerHTML = `${operation.desription}
    <span class="history__money">${operation.amount} ₽</span>
    <button class="history_delete" data-id="${operation.id}">x</button>
  `;
  historyList.append(li);
};

const updateBalance = () => {
  const resultIncome = dbOperation
  .filter((item) => item.amount > 0)
  .reduce((result, item) => result + item.amount, 0);
  const resultExpenses = dbOperation
  .filter((item) => item.amount < 0)
  .reduce((result, item) => result + item.amount, 0);

  totalMoneyIncome.textContent = resultIncome;
  totalMoneyExpenses.textContent = resultExpenses;
  totalBalance.textContent = resultIncome + resultExpenses;
};

const addOperation = (event) => {
  event.preventDefault();
  const operationNameValue = operationName.value,
        operationAmountValue = operationAmount.value;
  
        operationAmount.style.borderColor = '';
        operationName.style.borderColor = '';

        if (operationAmountValue && operationNameValue) {
          const operation = {
            id : generateId(),
            desription : operationNameValue,
            amount : +operationAmountValue
          }
          dbOperation.push(operation);
          init();
        }
        else {
          if (!operationAmountValue) operationAmount.style.borderColor = 'red';
          if (!operationNameValue) operationName.style.borderColor = 'red';
        }
        operationName.value = '';
        operationAmount.value = '';
}

const init = () => {
  historyList.textContent = '';
  dbOperation.forEach(renderOperation);
  updateBalance();
  localStorage.setItem('calc_history', JSON.stringify(dbOperation));
};

const deleteOperation = (event) => {
  const target = event.target;
  if (target.classList.contains('history_delete')) {
    dbOperation = dbOperation.filter((operation) => operation.id !== target.dataset.id);
    init();
  }
}

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation);

init();