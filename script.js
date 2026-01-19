let currentPart = 1;
const pendenciaWeeks = [5, 10, 15, 23, 28, 33, 41, 46, 51]; // [cite: 1753]

function changePart(p) {
    currentPart = p;
    document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i+1 === p));
    init();
}

function init() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    const start = (currentPart - 1) * 18 + 1; // [cite: 1729-1731]
    const end = currentPart * 18;

    for (let i = start; i <= end; i++) {
        const isP = pendenciaWeeks.includes(i);
        grid.innerHTML += `
            <div class="card ${isP ? 'pendencia' : ''}">
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <span style="font-weight:bold; color:var(--accent)">WEEK ${i}</span>
                    <span style="font-size:10px">${isP ? 'RECOVERY MODE' : 'STABLE'}</span>
                </div>
                <h4 style="margin:10px 0">${isP ? 'Semana de Pendências' : 'Metas da Semana'}</h4>
                <div class="meta-row"><input type="checkbox" id="w${i}l" onchange="sync()"><label>Letra da Lei</label></div>
                <div class="meta-row"><input type="checkbox" id="w${i}m" onchange="sync()"><label>Lista de Metas</label></div>
                <div class="meta-row"><input type="checkbox" id="w${i}q" onchange="sync()"><label>Questões</label></div>
            </div>`;
    }
    load();
}

function sync() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => localStorage.setItem(c.id, c.checked));
    updateProgress();
}

function saveNotes() { localStorage.setItem('duo-notes', document.getElementById('user-notes').value); }

function load() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        c.checked = localStorage.getItem(c.id) === 'true';
    });
    document.getElementById('user-notes').value = localStorage.getItem('duo-notes') || '';
    updateProgress();
}

function updateProgress() {
    const checks = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    const done = checks.filter(c => c.checked).length;
    const perc = Math.round((done / checks.length) * 100) || 0;
    document.getElementById('bar').style.width = perc + '%';
    document.getElementById('status-txt').innerText = perc + '% SYNCED';
}

function clearAll() {
    if(confirm("Deseja resetar todo o progresso e anotações?")) {
        localStorage.clear();
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => init());
