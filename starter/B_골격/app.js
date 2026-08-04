// D04 - 채용공고 필터 (B 골격 - Scaled)
// 원칙: 원본 배열(originalRows)은 절대 바꾸지 않는다 - 정리(clean)와 필터(filter)는
//       항상 새 배열을 만들어 반환한다. 이 파일 어디에서도 배열을 push/splice/sort로
//       직접 변형하지 않는다.
//
// 이 파일은 A_완성본/app.js와 구조가 같다. 다른 점은 filterByCategory / filterBySource
// 딱 두 함수뿐이다 - 아래 TODO를 채우면 A_완성본과 똑같이 동작한다.
// 프롬프트_템플릿.md를 열어 AI에게 두 함수를 채워달라고 요청하세요.

const CSV_PATH = 'data/jobs_dirty_B.csv';
const MISSING_FILTER = '__MISSING__';
const MISSING_LABEL = '미기재(원본 빈칸)';

let originalRows = [];   // CSV 원본 파싱 결과 - 불변, 이후 재할당하지 않는다
let cleanedRows = [];    // D03 정리 규칙(중복 제거 + 원본 값 보존) 적용 결과 - 파생 배열
let filteredRows = [];   // cleanedRows에 현재 filter 선택값을 적용한 결과 - 파생 배열

// ---------------------------------------------------------------------------
// 1. CSV 파싱 (fetch + 직접 구현한 split - 외부 라이브러리 없음)
//    큰따옴표로 묶인 필드 안의 콤마를 안전하게 처리한다.
// ---------------------------------------------------------------------------

function stripBOM(text) {
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1);
  }
  return text;
}

function parseCSVLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function parseCSV(text) {
  const lines = text.split(/\r\n|\n/).filter((line) => line.length > 0);
  if (lines.length === 0) return [];

  const header = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    header.forEach((key, idx) => {
      row[key] = (values[idx] !== undefined ? values[idx] : '').trim();
    });
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// 2. D03 정리 규칙 (완성됨 - 손대지 않아도 됩니다)
//    규칙 1) 중복 제거: 회사명 + 제목이 같으면 같은 공고로 보고 먼저 나온 것만 남긴다.
//    규칙 2) 빈값 보존: 원본 열의 빈칸은 새 값으로 덮지 않는다.
//            화면에서만 "(빈칸)"으로 보이고, 필터에는 "미기재(원본 빈칸)" 선택지를 둔다.
// ---------------------------------------------------------------------------

function normalizeForDedup(value) {
  return value
    .trim()
    .replace(/\(주\)/g, '')
    .replace(/㈜/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function removeDuplicates(rows) {
  const seenKeys = new Set();
  const kept = [];

  for (const row of rows) {
    const key = normalizeForDedup(row.company) + '|' + normalizeForDedup(row.title);
    if (seenKeys.has(key)) {
      continue;
    }
    seenKeys.add(key);
    kept.push(row);
  }
  return kept;
}
function preserveValues(rows) {
  return rows.map((row) => Object.assign({}, row));
}

function cleanData(rows) {
  return preserveValues(removeDuplicates(rows));
}

// ---------------------------------------------------------------------------
// 3. D04 필터 함수 3개 (지역만 완성 - 경력 조건/채널은 TODO)
//    value가 빈 문자열("전체" 선택)이면 필터를 적용하지 않고 그대로 돌려준다.
//    select 옵션은 실제 데이터 값 그대로이므로 완전일치(===)로 비교한다.
// ---------------------------------------------------------------------------

// 완성 - 지역 필터 (경력 조건/채널 함수를 채울 때 이 함수를 그대로 참고하세요 - 구조가 같습니다)
function filterByRegion(rows, value) {
  if (!value) return rows;
  return rows.filter((row) => matchesFilterValue(row.region, value));
}

function matchesFilterValue(rowValue, selectedValue) {
  if (selectedValue === MISSING_FILTER) return rowValue.trim() === '';
  return rowValue === selectedValue;
}

// TODO(Scaled): 경력 조건(category) 필터를 완성하세요.
// 프롬프트_템플릿.md의 빈칸 [필터 대상 열]에 "category"를 넣어 AI에게 요청하면 됩니다.
// 힌트: 위 filterByRegion과 구조가 완전히 같습니다 - matchesFilterValue에 row.category를 전달합니다.
function filterByCategory(rows, value) {
  // TODO: value가 비어 있지 않으면 matchesFilterValue(row.category, value)가 참인 행만 남기세요.
  // value가 비어 있으면("전체" 선택) rows를 그대로 반환하세요.
  return rows; // 지금은 아무 필터도 걸리지 않습니다 - 위 TODO를 채우면 동작합니다.
}

// TODO(Scaled): 채널(source) 필터를 완성하세요.
// 프롬프트_템플릿.md의 빈칸 [필터 대상 열]에 "source"를 넣어 AI에게 요청하면 됩니다.
// 힌트: 위 filterByRegion과 구조가 완전히 같습니다 - matchesFilterValue에 row.source를 전달합니다.
function filterBySource(rows, value) {
  // TODO: value가 비어 있지 않으면 matchesFilterValue(row.source, value)가 참인 행만 남기세요.
  // value가 비어 있으면("전체" 선택) rows를 그대로 반환하세요.
  return rows; // 지금은 아무 필터도 걸리지 않습니다 - 위 TODO를 채우면 동작합니다.
}

function applyFilters(rows, selected) {
  let result = rows;
  result = filterByRegion(result, selected.region);
  result = filterByCategory(result, selected.category);
  result = filterBySource(result, selected.source);
  return result; // cleanedRows 자체는 이 과정에서 한 번도 바뀌지 않는다
}

// ---------------------------------------------------------------------------
// 4. select 옵션 채우기 (완성 - 손대지 않아도 됩니다)
// ---------------------------------------------------------------------------

function uniqueValues(rows, field) {
  const rawValues = rows.map((row) => row[field]);
  const hasMissing = rawValues.some((value) => value.trim() === '');
  const values = Array.from(new Set(rawValues.filter((value) => value.trim() !== '')))
    .sort((a, b) => a.localeCompare(b, 'ko'));
  if (hasMissing) values.push(MISSING_FILTER);
  return values;
}

function populateSelect(selectEl, values) {
  values.forEach((value) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value === MISSING_FILTER ? MISSING_LABEL : value;
    selectEl.appendChild(opt);
  });
}

// ---------------------------------------------------------------------------
// 5. 브라우저 전용 구간 (렌더링 + 이벤트 + 초기 로드) - 완성, 손대지 않아도 됩니다
// ---------------------------------------------------------------------------

if (typeof document !== 'undefined') {
  const els = {
    region: document.getElementById('region-select'),
    category: document.getElementById('category-select'),
    source: document.getElementById('source-select'),
    reset: document.getElementById('reset-btn')
  };

  const COLUMNS = ['id', 'source', 'title', 'company', 'region', 'category', 'date'];
  let filterTouched = false;

  function renderTable(rows) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    if (rows.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = COLUMNS.length;
      td.className = 'empty-row';
      td.textContent = '조건에 맞는 공고가 없습니다 (0행도 하나의 관측 결과입니다)';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    rows.forEach((row) => {
      const tr = document.createElement('tr');
      COLUMNS.forEach((key) => {
        const td = document.createElement('td');
        td.textContent = row[key] === '' ? '(빈칸)' : row[key];
        if (key === 'source') td.className = 'col-source';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderCleanupSummary(beforeCount, afterCount) {
    const el = document.getElementById('cleanup-count');
    const removed = beforeCount - afterCount;
    el.textContent = `정리 전 ${beforeCount}행 -> 정리 후 ${afterCount}행 (중복 ${removed}건 제거)`;
  }

  function renderFilterCount(beforeCount, afterCount) {
    const el = document.getElementById('filter-count');
    el.textContent = `필터 전 ${beforeCount}행 -> 지금 ${afterCount}행`;
  }

  function onFilterChange() {
    filterTouched = true;
    const selected = {
      region: els.region.value,
      category: els.category.value,
      source: els.source.value
    };
    filteredRows = applyFilters(cleanedRows, selected);
    renderTable(filteredRows);
    renderFilterCount(cleanedRows.length, filteredRows.length);
  }

  els.region.addEventListener('change', onFilterChange);
  els.category.addEventListener('change', onFilterChange);
  els.source.addEventListener('change', onFilterChange);
  els.reset.addEventListener('click', () => {
    els.region.value = '';
    els.category.value = '';
    els.source.value = '';
    onFilterChange();
  });

  function setupCompletionReceipt() {
    const anchor = document.getElementById('data-declaration');
    const btn = document.createElement('button');
    const note = document.createElement('span');

    btn.type = 'button';
    btn.textContent = '실행 완료 영수증 복사';
    btn.style.cssText = 'margin:14px 0;padding:8px 18px;font-size:14px;cursor:pointer;border:1px solid #1a7f37;border-radius:6px;background:#f2fbf5;';
    note.style.cssText = 'margin-left:10px;font-size:13px;color:#666;';

    function refreshReceipt() {
      const originalIds = new Set(originalRows.map((row) => row.id));
      const originalById = new Map(originalRows.map((row) => [row.id, row]));
      const idsPreserved = filteredRows.every((row) => originalIds.has(row.id));
      const valuesPreserved = filteredRows.every((row) => {
        const original = originalById.get(row.id);
        return original && COLUMNS.every((key) => original[key] === row[key]);
      });
      const countChanged = filteredRows.length !== cleanedRows.length;
      const pass = filterTouched && countChanged && idsPreserved && valuesPreserved;
      btn.disabled = !pass;
      note.textContent = pass
        ? 'PASS - 눌러서 복사한 뒤 해당 세션 스레드에 붙여넣으세요'
        : '필터를 골라 행수를 바꾸면 활성화됩니다';
      return pass;
    }

    btn.addEventListener('click', async () => {
      if (!refreshReceipt()) return;
      const selected = [
        `지역=${els.region.value || '전체'}`,
        `경력 조건=${els.category.value || '전체'}`,
        `채널=${els.source.value || '전체'}`
      ].join(', ');
      const receipt = `[실행 완료] ${selected} / 필터 전 ${cleanedRows.length}행 -> 지금 ${filteredRows.length}행 / ID 보존=PASS / 원본 값 보존=PASS`;
      await navigator.clipboard.writeText(receipt);
      note.textContent = '복사됨 - 해당 세션 스레드에 붙여넣으세요';
    });

    anchor.appendChild(btn);
    anchor.appendChild(note);
    refreshReceipt();
    return refreshReceipt;
  }

  async function init() {
    const res = await fetch(CSV_PATH);
    const raw = await res.text();
    const text = stripBOM(raw);

    originalRows = parseCSV(text);
    cleanedRows = cleanData(originalRows);
    filteredRows = cleanedRows;

    populateSelect(els.region, uniqueValues(cleanedRows, 'region'));
    populateSelect(els.category, uniqueValues(cleanedRows, 'category'));
    populateSelect(els.source, uniqueValues(cleanedRows, 'source'));

    renderCleanupSummary(originalRows.length, cleanedRows.length);
    renderTable(filteredRows);
    renderFilterCount(cleanedRows.length, filteredRows.length);
    const refreshReceipt = setupCompletionReceipt();
    els.region.addEventListener('change', refreshReceipt);
    els.category.addEventListener('change', refreshReceipt);
    els.source.addEventListener('change', refreshReceipt);
    els.reset.addEventListener('click', refreshReceipt);
  }

  init().catch((err) => {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML =
      `<tr><td colspan="${COLUMNS.length}">데이터를 불러오지 못했습니다. ` +
      `VS Code에서 Live Server로 열었는지 확인하세요. (오류: ${err.message})</td></tr>`;
    console.error(err);
  });
}

// ---------------------------------------------------------------------------
// 6. Node 검증용 export (브라우저에서는 무시된다)
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    stripBOM,
    parseCSVLine,
    parseCSV,
    normalizeForDedup,
    removeDuplicates,
    preserveValues,
    cleanData,
    filterByRegion,
    filterByCategory,
    filterBySource,
    matchesFilterValue,
    applyFilters,
    uniqueValues
  };
}
