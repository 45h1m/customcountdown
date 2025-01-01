const $ = (name) => document.querySelector(name);

let { time, msg } = parseUrlData();

const toDate = new Date(time);

console.log(time, msg);

let renderLoop = setInterval(renderTime, 1000);

renderTime();
renderMsg(msg);

$("#new-counter-form").onsubmit = createNewCounter;

function handleOpenCreateSection() {
    $("#custom_page").classList.add('active');
    $("#msg-input").focus();
    $("#msg-input").select();
}

function triggerShare() {
    window.navigator.share({
        title: msg + " - Countdown",
        text: "Check cool countdown timer by 45h1m",
        url: window.location.href,
    });
}

function renderTime() {
    const time = timeLeft(toDate);

    if (time.leftTime < 0) {
        clearInterval(renderLoop);
        renderCompletion();
        return;
    }

    $("#day-display").innerText = time.day;
    $("#day-text-display").innerText = time.day > 1 ? "days" : "day";
    $("#hour-display").innerText = time.hour;
    $("#hour-text-display").innerText = time.hour > 1 ? "hours" : "hour";
    $("#min-digit-1").setAttribute("data-digit", time.min.toString().split("")[0]);
    $("#min-digit-2").setAttribute("data-digit", time.min.toString().split("")[1]);
    $("#sec-digit-1").setAttribute("data-digit", time.sec.toString().split("")[0]);
    $("#sec-digit-2").setAttribute("data-digit", time.sec.toString().split("")[1]);
}

function timeLeft(toDate) {
    const fromDate = new Date();

    const _sec = 1000,
        _min = _sec * 60,
        _hour = _min * 60,
        _day = _hour * 24;

    let leftTime = toDate.getTime() - fromDate.getTime(),
        day = parseInt(leftTime / _day),
        hour = parseInt((leftTime % _day) / _hour),
        min = parseInt(((leftTime % _day) % _hour) / _min),
        sec = parseInt((((leftTime % _day) % _hour) % _min) / _sec);

    min = ("0" + min.toString()).slice(-2); // return "01" not "1"
    sec = ("0" + sec.toString()).slice(-2);

    return { leftTime, day, hour, min, sec };
}

function renderCompletion() {
    document.body.classList.add("complete");
}

function parseUrlData() {
    try {
        let base64 = window.location.href.split("?")[1];
        let data = JSON.parse(atob(base64));
        return data;
    } catch (err) {
        return {
            time: new Date("1/1/2026"),
            msg: "New Year 2026",
        };
    }
}

function renderMsg(msg) {
    const words = msg.split(" ");
    let html = "";
    words.forEach((word) => {
        html += `<span class="word">${word}</span> `;
    });
    $("#msg-display").innerHTML = html;
}

function toggleFullScreen(clickedElem) {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        clickedElem.classList.add("a");
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
        clickedElem.classList.remove("a");
    }
}

function createNewCounter(e) {
    e.preventDefault();

    const msg = $("#msg-input").value;
    const dateTimeLocalValue = $("#date-time-input").value;

    const fakeUtcTime = new Date(`${dateTimeLocalValue}Z`);
    const date = new Date(fakeUtcTime.getTime() + fakeUtcTime.getTimezoneOffset() * 60000);
    const time = date.getTime();

    const data = { time, msg };

    const json = JSON.stringify(data);
    console.log(json);

    const base64 = btoa(json);

    console.log(base64);

    window.location = window.location.origin + "?" + base64;
}

console.log(new Date(2024, 0, 1).getTime());
