let currentMode = '8h1';
let currentPart = 1;
const totalSemanas = 54; // [cite: 1, 18-21]
const alerts = [5, 10, 15, 23, 28, 33, 41, 46, 51]; // [cite: 26-30]

const content = {
    days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    subjects: ["Penal", "Constitucional", "Civil/Emp.", "Proc. Civil", "Proc. Penal", "Humanos/ECA"],
    modes: {
        '8h1': { label: '8h Opção 1', tasks: ['Lei (2h)', 'Metas (4h)', 'Questões (2h)'] },
        '8h2': { label: '8h Opção 2', tasks: ['Doutrina (5h)', 'Lei+Juris (2h)', 'Questões (1h)'] },
        '6h1': { label: '6h Opção 1', tasks: ['Lei (1.5h)', 'Metas (3h)', 'Questões (1.5h)'] },
        '6h2': { label: '6h Opção 2', tasks: ['Metas (4h)', 'Questões (2h)'] },
        '4h': { label: '4h Padrão', tasks: ['Lei (1h)', 'Metas (2h)', 'Questões (1h)'] },
        '3h': { label: '3h Padrão', tasks: ['Metas (1.5h)', 'Questões (1.5h)'] }
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
    const start = (currentPart - 1) * 18 + 1;
    const end = currentPart * 18;

    for (let i = start; i <= end; i++) {
        const isA = alerts.includes(i);
        const mode = content.modes[currentMode];
        
        let cardHtml = `
            <div class="card-study ${isA ? 'alerta-rev' : ''}">
                <span class="week-id">SEMANA ${i}</span>
                <h4>${isA ? 'ALERTA REVISÃO' : 'METAS SEMANAIS'}</h4>
                <p style="font-size:11px; color:#6c757d">${mode.label}</p>`;

        if (isA) {
            cardHtml += `<div class="day-box"><p style="font-size:13px; color:#FF1744; font-weight:600">PARE TUDO: Revise o caderno de erros e as metas do bloco anterior antes de seguir.</p></div>`;
        } else {
            content.days.forEach((day, idx) => {
                cardHtml += `<div class="day-box"><span class="day-title">${day} - ${content.subjects[idx]}</span>`;
                mode.tasks.forEach((task, tIdx) => {
                    const id = `${currentMode}-w${i}-d${idx}-t${tIdx}`;
                    const color = task.includes('Lei') ? 'green' : (task.includes('Metas') || task.includes('Doutrina') ? 'pink' : 'gray');
                    cardHtml += `
                        <div class="item">
                            <input type="checkbox" id="${id}" onchange="save()">
                            <span class="box ${color}"></span>
                            <label for="${id}">${task}</label>
                        </div>`;
                });
                cardHtml += `</div>`;
            });
        }
        grid.innerHTML += cardHtml + `</div>`;
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
    document.getElementById('perc-label').innerText = `${perc}% CONCLUÍDO`;
}

function exportProgress() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu-progresso-duo-${new Date().toLocaleDateString()}.json`;
    a.click();
}

function importProgress(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const data = JSON.parse(reader.result);
        Object.keys(data).forEach(key => localStorage.setItem(key, data[key]));
        location.reload();
    };
    reader.readAsText(file);
}

function clearAll() { if(confirm("Deseja apagar tudo?")) { localStorage.clear(); location.reload(); } }

document.addEventListener('DOMContentLoaded', render);
