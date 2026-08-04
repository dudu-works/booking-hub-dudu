// spec_ref: Day7-오후실습-케이스2-재제작-지시(한얼-260728)#산출물4-app_js
const CSV_PATH = 'data/raw.csv';

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

function render(rows) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  document.getElementById('head').innerHTML = `<tr>${headers.map((header) => `<th>${escapeHTML(header)}</th>`).join('')}</tr>`;
  document.getElementById('body').innerHTML = rows.map((row) => (
    `<tr>${headers.map((header) => `<td>${escapeHTML(row[header])}</td>`).join('')}</tr>`
  )).join('');
  document.getElementById('count').textContent = `원본 ${rows.length}행`;
}

if (typeof document !== 'undefined') {
  fetch(CSV_PATH)
    .then((response) => {
      if (!response.ok) throw new Error(`CSV ${response.status}`);
      return response.text();
    })
    .then((text) => render(parseCSV(text)))
    .catch((error) => {
      document.getElementById('count').textContent = `로드 실패: ${error.message}`;
    });
}

if (typeof module !== 'undefined') {
  module.exports = { parseCSVLine, parseCSV };
}
