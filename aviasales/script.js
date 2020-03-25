// form/page elements
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart'),
    cheapest_ticket = document.getElementById('cheapest-ticket'),
    cheap_tickets = document.getElementById('other-cheap-tickets');
// data/constant
const CITIES_API_1 = 'dataBase/cities.json', // locally downloaded
    CITIES_API_2 = 'http://api.travelpayouts.com/data/ru/cities.json';
    PROXY = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '938466b15413fb0f140e803063e13a31',
    CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload',
    tickets_count = 5;
let city = [];
// function expression
const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;
        if (request.status === 200) callback(request.response);
        else console.error(request.status);
    });
    request.send();
}
const showCity = (input, list) => {
    list.textContent = '';
    if (input.value == '') return;
    const filterCity = city.filter((item) => {
        const fixItem = item.name.toLowerCase();
        return fixItem.startsWith(input.value.toLowerCase());
    });
    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);
    })
};
const selectCity = (input, list, event) => {
    let target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};
// rendering cheapest ticket
const renderCheapDay = (tickets) => {
    cheapest_ticket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    cheapest_ticket.append(createCard(tickets[0]));
}
// rendering first N cheap tickets
const renderCheapYear = (tickets) => {
    cheap_tickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    tickets.sort((a,b) => a.value - b.value);
    const count = tickets_count < tickets.length ? tickets_count : tickets.length;
    const first_n_tickets = tickets.slice(1, count).map(item => createCard(item));
    first_n_tickets.forEach(ticket => cheap_tickets.append(ticket));
}
// render container
const renderCheap = (data, date) => {
    const ticket_year= JSON.parse(data).best_prices;
    const ticket_day = ticket_year.filter((item) => item.depart_date === date);
    renderCheapDay(ticket_day);
    renderCheapYear(ticket_year);
};
const getChanges = (changes) => {
  if (changes){
      return 'Количество пересадок ' + changes;
  }  else {
      return 'Без пересадок';
  }
};
const getNameCity = (code) => city.find(item => item.code === code).name;
const getDate = (date) => new Date(date).toLocaleDateString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});
const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    let deep = '';
    if (data) {
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить за ${data.value}Р</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">Вылет из города: <br>
                            <span class="city__name">${getNameCity(data.origin)}</span>
                        </div>
                        <div class="date">${getDate(data.depart_date)}</div>
                    </div>
                
                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="city__to">Город назначения: <br>
                            <span class="city__name">${getNameCity(data.destination)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else deep = '<h3>К сожалению билетов на текущую дату не нашлось</h3>';
    ticket.insertAdjacentHTML('afterbegin', deep);
    return ticket;
}
const renderError = () => {
    const message = confirm('Вы ввели не существующий город');
    if (message) { // clear fields due to invalid input
        inputCitiesTo.value = '';
        inputCitiesFrom.value = '';
        dropdownCitiesFrom.textContent = '';
        dropdownCitiesTo.textContent = '';
        inputDateDepart.value = '';
    } // otherwise user corrects input by himself
}
// event listeners
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});
dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(inputCitiesFrom, dropdownCitiesFrom, event)
});
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});
dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(inputCitiesTo, dropdownCitiesTo, event)
});
formSearch.addEventListener('submit', (event)  => {
    event.preventDefault(); // reboot is off
    cheapest_ticket.textContent ='';
    cheap_tickets.textContent='';
    const form_data = {
        from: city.find((item) => inputCitiesFrom.value === item.name),
        to: city.find(item => inputCitiesTo.value === item.name),
        when: inputDateDepart.value
    };
    if (form_data.from && form_data.to) {
        const request_data = `?depart_date=${form_data.when}&origin=${form_data.from.code}&destination=${form_data.to.code}&one_way=${true}`;
        getData(CALENDAR + request_data, (response) => {
            renderCheap(response, form_data.when);
        });
    }
    else renderError();
})
// function calling
// getting all cities
getData(PROXY + CITIES_API_2, (data) => {
    city = JSON.parse(data).filter(item => item.name);
});