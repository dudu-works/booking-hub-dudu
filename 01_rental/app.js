const CSV_PATH = 'data/raw.csv';
let allData = [];

function parseCSVLine(line){const out=[];let cur='';let q=false;for(let i=0;i<line.length;i++){const ch=line[i];if(q&&ch==='"'&&line[i+1]==='"'){cur+='"';i++;}else if(ch==='"'){q=!q;}else if(ch===','&&!q){out.push(cur);cur='';}else{cur+=ch;}}out.push(cur);return out;}
function parseCSV(text){const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean);if(!lines.length)return[];const headers=parseCSVLine(lines[0]);return lines.slice(1).map(line=>Object.fromEntries(headers.map((h,i)=>[h,(parseCSVLine(line)[i]||'').trim()])));}

function normalizeBoolean(val) {
  if (!val) return 'X';
  const v = val.toUpperCase();
  if (['Y', 'YES', '예', 'TRUE', '가능'].includes(v)) return 'O';
  return 'X';
}

function normalizeData(rows) {
  return rows.map(r => ({
    ...r,
    near_kaist: normalizeBoolean(r.near_kaist),
    minor_co_resident_allowed: normalizeBoolean(r.minor_co_resident_allowed),
    six_month_contract: normalizeBoolean(r.six_month_contract),
    monthly_rent_만원: parseInt(r.monthly_rent_만원) || 0,
    deposit_만원: parseInt(r.deposit_만원) || 0
  }));
}

function render(rows){
  const headers=rows.length?Object.keys(rows[0]):[];
  document.getElementById('head').innerHTML='<tr>'+headers.map(h=>`<th>${h}</th>`).join('')+'</tr>';
  document.getElementById('body').innerHTML=rows.map(r=>'<tr>'+headers.map(h=>`<td>${r[h]}</td>`).join('')+'</tr>').join('');
  document.getElementById('count').textContent=`검색 결과: ${rows.length}행 (원본 ${allData.length}행)`;
}

function applyFilters() {
  const area = document.getElementById('filter-area').value;
  const kaist = document.getElementById('filter-kaist').checked;
  const minor = document.getElementById('filter-minor').checked;
  const sixMonth = document.getElementById('filter-six-month').checked;
  const maxRent = document.getElementById('filter-rent').value;
  const maxDeposit = document.getElementById('filter-deposit').value;

  const filtered = allData.filter(r => {
    if (area && r.area !== area) return false;
    if (kaist && r.near_kaist !== 'O') return false;
    if (minor && r.minor_co_resident_allowed !== 'O') return false;
    if (sixMonth && r.six_month_contract !== 'O') return false;
    if (maxRent && r.monthly_rent_만원 > parseInt(maxRent)) return false;
    if (maxDeposit && r.deposit_만원 > parseInt(maxDeposit)) return false;
    return true;
  });
  render(filtered);
}

function setupFilters(data) {
  const areas = [...new Set(data.map(d => d.area))];
  const areaSelect = document.getElementById('filter-area');
  areas.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a;
    areaSelect.appendChild(opt);
  });

  const inputs = ['filter-area', 'filter-kaist', 'filter-minor', 'filter-six-month', 'filter-rent', 'filter-deposit'];
  inputs.forEach(id => document.getElementById(id).addEventListener('change', applyFilters));
  document.getElementById('filter-rent').addEventListener('input', applyFilters);
  document.getElementById('filter-deposit').addEventListener('input', applyFilters);
  
  document.getElementById('btn-reset').addEventListener('click', () => {
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el.type === 'checkbox') el.checked = false;
      else el.value = '';
    });
    applyFilters();
  });
}

if(typeof document!=='undefined'){
  fetch(CSV_PATH).then(r=>{if(!r.ok)throw new Error(`CSV ${r.status}`);return r.text();})
  .then(t => {
    allData = normalizeData(parseCSV(t));
    setupFilters(allData);
    render(allData);
  })
  .catch(e=>{document.getElementById('count').textContent=`로드 실패: ${e.message}`;});
}
if(typeof module!=='undefined')module.exports={parseCSVLine,parseCSV};
