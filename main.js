// main.js — 화면 담당. P1 ~ P5, P7 에서 이어서 채웁니다.
//
// 상황: index.html 에 폼과 빈 표가 있고, 이 파일이 <script type="module"> 로 연결되어 있습니다.
//       아직 코드가 없어서 Check 를 누르면 페이지가 새로 고쳐지기만 합니다.
// 할 일: P1 Check 에 반응하기 → P2 예보 받기 → P3 표 그리기 → P4 좋은 날 표시
//       → P5 기준을 바꾸면 바로 다시 그리기 → P7 Why not 칸
// 실행: 터미널에서 npx serve . → 브라우저에서 http://localhost:3000
// 확인: 문제마다 problems/ 의 문제 파일 "확인"
// 커밋 메시지: p1: submit / p2: fetch / p3: rows / p4: rule / p5: live / p7: reasons
//
// 받아 오는 일은 api.js, 판단하는 규칙은 logic.js 에 둡니다. 이 파일에는 화면을 읽고 그리는 코드만.

// 주어짐: 도시 세 곳의 위도·경도. 키는 index.html <select> 의 option value 와 같습니다.
const CITIES = {
  seoul: { name: "Seoul", lat: 37.566, lon: 126.9784 },
  daejeon: { name: "Daejeon", lat: 36.3504, lon: 127.3845 },
  gangneung: { name: "Gangneung", lat: 37.7519, lon: 128.8761 },
};

// P1 부터 여기 아래에 씁니다.

import { getForecast } from "./api.js";
import { toDays, isGoodDay, summarize } from "./logic.js";

const form = document.getElementById("run-form");
const citySelect = document.getElementById("city");
const rainInput = document.getElementById("rain-limit");
const windInput = document.getElementById("wind-limit");
const statusEl = document.getElementById("status");
const summaryEl = document.getElementById("summary");
const rowsEl = document.getElementById("rows");

// 화면에 표시할 데이터
const state = {
    city: null,
    days: [],
    limits: {
        rain: Number(rainInput.value),
        wind: Number(windInput.value)
    }
};

// 하루 예보를 표의 한 줄로 만들기
function dayRow(day) {
    const tr = document.createElement("tr");

    const dateTd = document.createElement("td");
    dateTd.textContent = day.date.slice(5);

    const maxTd = document.createElement("td");
    maxTd.textContent = `${day.max}°`;

    const windTd = document.createElement("td");
    windTd.textContent = `${day.wind} km/h`;

    const rainTd = document.createElement("td");
    rainTd.textContent = `${day.rain}%`;

    tr.append(dateTd, maxTd, windTd, rainTd);

    if (isGoodDay(day, state.limits)) {
    tr.classList.add("good");
}

    return tr;
}

// state에 저장된 날짜들을 표에 출력
function render() {
    if (state.city) {
        summaryEl.textContent =
            `${state.city.name}: ${summarize(state.days, state.limits)}.`;
    } else {
        summaryEl.textContent = "";
    }

    const rows = state.days.map(dayRow);
    rowsEl.replaceChildren(...rows);
}

// Check 버튼을 눌렀을 때
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = CITIES[citySelect.value];

    state.limits = {
    rain: Number(rainInput.value),
    wind: Number(windInput.value)
    };

    statusEl.classList.remove("error");
    statusEl.textContent = "Loading...";

    try {
        const daily = await getForecast(city);

        state.city = city;
        state.days = toDays(daily);

        statusEl.textContent = "";
    } catch (err) {
        statusEl.textContent =
            `Could not load the forecast (${err.message}).`;

        statusEl.classList.add("error");
    }

    render();
});

function updateLimits() {
    state.limits = {
        rain: Number(rainInput.value),
        wind: Number(windInput.value)
    };

    render();
}

rainInput.addEventListener("input", updateLimits);
windInput.addEventListener("input", updateLimits);
