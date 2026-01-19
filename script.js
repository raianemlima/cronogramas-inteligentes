let currentSchedule = '8h1';
let currentPart = 1;
const pendenciaWeeks = [5, 10, 15, 23, 28, 33, 41, 46, 51];

// Base de dados simplificada (seguindo os arquivos enviados)
const scheduleData = {
    '8h1': { label: '8H OP 01', metas: ['Reforço Lei (2h)', 'Lista Metas (4h)', 'Questões (2h)'] },
    '8h2': { label: '8H OP 02', metas: ['Metas Doutrina (5h)', 'Lei + Juris (2h)', 'Questões (1h)'] },
    '6h1': { label: '6H OP 01', metas: ['Reforço Lei (1.5h)', 'Lista Metas (3h)', 'Questões (1.5h)'] },
    '6h2': { label: '6H OP 02', metas: ['Metas (4h)', 'Questões (2h)'] },
    '4h': { label: '4H PADRÃO', metas: ['Lei (1h)', 'Metas (2h)', 'Questões (1h)'] },
    '3h': { label: '3H PADRÃO', metas: ['Lei (1h)', 'Questões (2h)'] }
};

function changeSchedule() {
    currentSchedule = document.getElementById('schedule-select').value;
    render();
}

function setPart(p) {
    currentPart = p;
    document.querySelectorAll('.part-btn').forEach((b, i) => b.classList.toggle('active', i+1 === p));
    render();
}

function render() {
    const grid = document.getElementById('cronograma-grid');
    grid.innerHTML = '';
    
    const start = (currentPart - 1) * 18 + 1;
    const end = currentPart * 18;

    for (let i = start; i <= end; i++) {
        const isP = pendenciaWeeks.includes(i);
        const data = scheduleData[currentSchedule];
        
        let metaHtml = data.metas.map((m, idx) => `
            <div class="meta-item">
                <input type="checkbox" id="${currentSchedule}-w${i}-m${idx}" onchange="sync()">
                <label for="${currentSchedule}-w${i}-m${idx}">
                    <span class="${idx === 0 ? 'label-v' : 'label-a'}">${m.split('(')[0]}</span> 
                    <small>(${m.split('(')[1]}</small>
                </label>
            </div>
        `).join('');

        grid.innerHTML += `
            <div class="card ${isP ? 'alerta' : ''}">
                <span class="week-num">S${i}</span>
                <h4>${isP ? '⚠️ SEMANA DE PENDÊNCIAS' : 'CRONOGRAMA ATIVO'}</h4>
                <p style="font-size:12px; opacity:0.7">${data.label}</p>
                ${metaHtml}
                ${isP ? '<p class="label-r" style="font-size:11px">Pausa para revisão do bloco anterior.</p>' : ''}
            </div>`;
    }
    load();
}

function sync() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => localStorage.setItem(c.id, c.checked));
    updateProgress();
}

function saveNotes() { localStorage.setItem('duo-notes-global', document.getElementById('notes-area').value); }

function load() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        c.checked = localStorage.getItem(c.id) === 'true';
    });
    document.getElementById('notes-area').value = localStorage.getItem('duo-notes-global') || '';
    updateProgress();
}

function updateProgress() {
    const all = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    const done = all.filter(c => c.checked).length;
    const perc = Math.round((done / (54 * 3)) * 100) || 0; // Baseado no total global
    document.getElementById('main-progress').style.width = perc + '%';
    document.getElementById('progress-text').innerText = perc + '% CONCLUÍDO';
}

function resetAll() {
    if(confirm("Deseja apagar TODO o seu progresso?")) {
        localStorage.clear();
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => render());
