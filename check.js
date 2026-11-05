// check.js — 브라우저 없이 규칙 확인하기. P6 에서 채우고 P7 에서 한 번 더 늘립니다.
//
// 상황: 규칙이 맞는지 매번 브라우저를 열고 표를 눈으로 대 보기는 번거롭고, 빠뜨리기 쉽습니다.
// 할 일: 손으로 만든 daily 로 logic.js 의 함수를 불러 console.log 합니다.
//       console.log 줄마다 오른쪽에 예상 결과를 주석으로 "실행하기 전에" 적습니다.
// 실행: 터미널에서 node check.js
// 확인: 출력이 주석의 예상과 전부 같습니다.
// 커밋 메시지: p6: check (P7 에서 늘린 것은 p7: reasons 에 같이)

import { toDays, isGoodDay, summarize } from "./logic.js";

// 1. 테스트용 날씨 데이터 직접 만들기
const daily = {
    time: ["11-21", "11-22", "11-23", "11-24"],
    temperature_2m_max: [12, 15, 10, 8],
    precipitation_probability_max: [10, 30, 20, 40],
    wind_speed_10m_max: [6.2, 10, 12, 5]
};

// 2. 기준 설정
const limits = {
    rain: 30,
    wind: 10
};

// 3. 날짜별 객체로 변환
const days = toDays(daily);

// 4. 첫 번째 날짜 객체 확인
console.log(days[0]);
// 예상: { date: '11-21', max: 12, wind: 6.2, rain: 10 }

// 5. 각 날짜의 달리기 적합 여부 확인
console.log(isGoodDay(days[0], limits)); // true (둘 다 기준 아래)
console.log(isGoodDay(days[1], limits)); // true (둘 다 기준과 같음)
console.log(isGoodDay(days[2], limits)); // false (풍속만 기준 초과)
console.log(isGoodDay(days[3], limits)); // false (강수만 기준 초과)

// 6. 전체 날짜 요약 확인
console.log(summarize(days, limits));
// 예상: good for a run on 2 of 4 days

// 7. 빈 배열 요약 확인
console.log(summarize([], limits));
// 예상: good for a run on 0 of 0 days
