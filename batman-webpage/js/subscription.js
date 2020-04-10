$(".subscribe-button").click(function(event) {
    event.preventDefault();
    //открыть модальное окно с id="myModal"
    let input = document.getElementsByClassName("subscribe-input")[0].value;
    if (input === "") $("#err").modal('show');
    else $("#subs").modal('show');
});