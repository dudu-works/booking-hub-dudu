// spec_ref: Day7-오후실습-케이스2-재제작-지시(한얼-260728)#산출물5-recovery_app_js
const CSV_PATH = 'data/cleaned.csv';

// 필터가 아니라 관점 전환이다 - 정책 A/B는 AND/OR로 합칠 수 있는 조건이 아니라
// 같은 데이터를 읽는 서로 다른 정책이므로 라디오(단일 선택)로 둔다.
const VIEWS = [
  ['all', '전체 보기'],
  ['strict', '정책 A - 엄격 (추가 비용 0원만 인정)'],
  ['loose', '정책 B - 느슨 (수강료 0원이면 인정)'],
];

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quoted && character === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += character;
    }
  }

  values.push(current);
  return values;
}

function parseCSV(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];

  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()]));
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function filterRows(rows, view) {
  if (view === 'strict') return rows.filter((row) => row.is_free_strict === '가능');
  if (view === 'loose') return rows.filter((row) => row.is_free_loose === '가능');
  return rows;
}

function render(rows, totalCount) {
  const head = document.getElementById('head');
  const body = document.getElementById('body');
  const count = document.getElementById('count');
  const headers = rows.length ? Object.keys(rows[0]) : (window.allRows && window.allRows.length ? Object.keys(window.allRows[0]) : []);

  head.innerHTML = `<tr>${headers.map((header) => `<th>${escapeHTML(header)}</th>`).join('')}</tr>`;
  body.innerHTML = rows.map((row) => (
    `<tr>${headers.map((header) => `<td>${escapeHTML(row[header])}</td>`).join('')}</tr>`
  )).join('');
  count.textContent = `전체 ${totalCount}행 -> 결과 ${rows.length}행`;
}

if (typeof document !== 'undefined') {
  const pageTitle = document.getElementById('page-title');
  const formula = document.getElementById('formula');
  const filters = document.getElementById('filters');
  const reset = document.getElementById('reset');
  window.allRows = [];

  pageTitle.textContent = '무료 교육 프로그램 포털 - 정책 A/B 복구본';
  formula.innerHTML = [
    '정책 A - 엄격: 수강료를 포함해 추가로 내야 하는 돈이 0원인 것만 무료로 본다.',
    '정책 B - 느슨: 수강료 항목 자체가 0원이면 무료로 본다(교재비·재료비·보증금은 별도 판단하지 않는다).',
    '두 정책 모두에서 "확인 필요"로 남는 행(자격조건 미확인)은 정책을 바꿔도 줄지 않는다.',
  ].map((line) => escapeHTML(line)).join('<br>');

  VIEWS.forEach(([value, label], index) => {
    filters.insertAdjacentHTML(
      'beforeend',
      `<label><input type="radio" name="view" value="${value}" ${index === 0 ? 'checked' : ''}> ${escapeHTML(label)}</label>`,
    );
  });

  function currentView() {
    const checked = document.querySelector('input[name="view"]:checked');
    return checked ? checked.value : 'all';
  }

  function apply() {
    render(filterRows(window.allRows, currentView()), window.allRows.length);
  }

  filters.addEventListener('change', apply);
  reset.onclick = () => {
    const first = document.querySelector('input[name="view"]');
    if (first) first.checked = true;
    apply();
  };

  fetch(CSV_PATH)
    .then((response) => {
      if (!response.ok) throw new Error(`CSV ${response.status}`);
      return response.text();
    })
    .then((text) => {
      window.allRows = parseCSV(text);
      apply();
    })
    .catch((error) => {
      document.getElementById('count').textContent = `로드 실패: ${error.message}`;
    });
}

if (typeof module !== 'undefined') {
  module.exports = { parseCSVLine, parseCSV, filterRows, VIEWS };
}
