let currentMode = '8h1';
let currentPart = 1;
const alerts = [5, 10, 15, 23, 28, 33, 41, 46, 51]; // 

const content = {
    days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    subjects: ["Penal", "Constitucional", "Civil", "Proc. Civil", "Proc. Penal", "D. Humanos / ECA"],
    modes: {
        '8h1': { label: '8h Opção 1', tasks: ['Lei (2h)', 'Metas (4h)', 'Questões (2h)'] },
        '8h2': { label: '8h Opção 2', tasks: ['Doutrina (5h)', 'Lei+Juris (2h)', 'Questões (1h)'] },
        '6h1': { label: '6h Opção 1', tasks: ['Lei (1.5h)', 'Metas (3h)', 'Questões (1.5h)'] },
        '6h2': { label: '6h Opção 2', tasks: ['Metas (4h)', 'Questões (2h)'] },
        '4h': { label: '4h Extensivo', tasks: ['Lei (1h)', 'Metas (2h)', 'Questões (1h)'] },
        '3h': { label: '3h Intensivo', tasks: ['Letra da Lei (1h)', 'Questões (2h)'] }
    }
};

function changeSchedule() {
    currentMode = document.getElementById('mode-select').value;
    render();
}

function switchPart(p) {
    currentPart = p;
    document.querySelectorAll('.part-btn').forEach((b, i) => b.classList.toggle('active', i+1 === p));
    render();
}

function render() {
    const grid = document.getElementById('content-grid');
    grid.innerHTML = '';
    const start = (currentPart - 1) * 18 + 1; //
    const end = currentPart * 18;

    for (let i = start; i <= end; i++) {
        const isA = alerts.includes(i);
        let cardHtml = `
            <div class="card-study ${isA ? 'alerta' : ''}">
                <span class="week-id">W${i}</span>
                <h4 style="margin:0">${isA ? 'Semanas de Pendências' : 'Sessão de Estudos'}</h4>
                <p style="font-size:10px; opacity:0.6">${content.modes[currentMode].label}</p>`;

        if (isA) {
            cardHtml += `<div class="day-box"><p style="font-size:12px; color:var(--pink-neon)">Foco total em revisar o caderno de erros e metas atrasadas do bloco anterior.</p></div>`;
        } else {
            content.days.forEach((day, idx) => {
                cardHtml += `
                    <div class="day-box">
                        <span class="day-title">${day} - ${content.subjects[idx]}</span>
                        ${content.modes[currentMode].tasks.map((task, tIdx) => {
                            const id = `${currentMode}-w${i}-d${idx}-t${tIdx}`;
                            return `
                                <div class="item">
                                    <input type="checkbox" id="${id}" onchange="save()">
                                    <span class="box ${task.includes('Lei') ? 'green' : task.includes('Metas') || task.includes('Doutrina') ? 'pink' : 'gray'}"></span>
                                    <label for="${id}">${task}</label>
                                </div>`;
                        }).join('')}
                    </div>`;
            });
        }
        cardHtml += `</div>`;
        grid.innerHTML += cardHtml;
    }
    load();
}

function save() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => localStorage.setItem(c.id, c.checked));
    updateProgress();
}

function load() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        c.checked = localStorage.getItem(c.id) === 'true';
    });
    document.getElementById('global-notes').value = localStorage.getItem('duo-notes') || '';
    updateProgress();
}

function saveNotes() { localStorage.setItem('duo-notes', document.getElementById('global-notes').value); }

function updateProgress() {
    const checks = document.querySelectorAll('input[type="checkbox"]');
    const done = Array.from(checks).filter(c => c.checked).length;
    const perc = Math.round((done / checks.length) * 100) || 0;
    document.getElementById('main-bar').style.width = perc + '%';
    document.getElementById('perc-label').innerText = `SISTEMA ${perc}% SINCRONIZADO`;
}

render();
