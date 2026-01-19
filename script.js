let currentMode = '8h1';
let currentPart = 1;
const alerts = [5, 10, 15, 23, 28, 33, 41, 46, 51]; // [cite: 26-30]

const config = {
    days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    // Mapeamento das disciplinas por carga horária
    lawSubjects: {
        '8h1': ["Penal", "Const.", "Civil", "P.Civil", "P.Penal", "ECA"],
        '8h2': ["Penal", "Const.", "Civil", "P.Civil", "P.Penal", "Revisão"],
        '6h1': ["Penal", "Const.", "Civil", "P.Civil", "P.Penal", "ECA"],
        '6h2': ["Penal", "Const.", "Civil", "P.Civil", "P.Penal", "Revisão"],
        '4h': ["P.Penal", "Const.", "Civil", "P.Civil", "Penal", "Humanos"],
        '3h': ["Metas", "Metas", "Metas", "Metas", "Metas", "Revisão"]
    },
    modes: {
        '8h1': { label: '8h Opção 1', tasks: ['Reforço Lei (3h)', 'Lista Metas (2.5h)', 'Questões (1.5h)'] },
        '8h2': { label: '8h Opção 2', tasks: ['Doutrina (5h)', 'Lei+Juris (2h)', 'Questões (1h)'] },
        '6h1': { label: '6h Opção 1', tasks: ['Reforço Lei (50min)', 'Lista Metas (2.5h)', 'Questões (1.5h)'] },
        '6h2': { label: '6h Opção 2', tasks: ['Reforço Lei (40min)', 'Lista Metas (2.5h)', 'Questões (2h)'] },
        '4h': { label: '4h Padrão', tasks: ['Reforço Lei (30min)', 'Lista Metas (1.5h)', 'Questões (1.5h)'] },
        '3h': { label: '3h Padrão', tasks: ['Lista Metas (1.5h)', 'Questões (1.5h)'] }
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
        const mode = config.modes[currentMode];
        const lawList = config.lawSubjects[currentMode];
        
        let cardHtml = `
            <div class="card-study ${isA ? 'alerta-rev' : ''}">
                <span class="week-id">SEMANA ${i}</span>
                <h4>${isA ? 'ALERTA REVISÃO' : 'METAS DIÁRIAS'}</h4>
                <p style="font-size:11px; color:#6c757d">${mode.label}</p>`;

        if (isA) {
            cardHtml += `<div class="day-box"><p style="font-size:13px; color:#FF1744; font-weight:600">PARE TUDO: Revise o caderno de erros e as metas do bloco anterior antes de seguir.</p></div>`;
        } else {
            config.days.forEach((day, idx) => {
                const lawSubject = lawList[idx];
                cardHtml += `<div class="day-box"><span class="day-title">${day}</span>`;
                
                mode.tasks.forEach((task, tIdx) => {
                    const id = `${currentMode}-w${i}-d${idx}-t${tIdx}`;
                    const isLaw = task.includes('Reforço Lei');
                    const color = isLaw ? 'green' : (task.includes('Metas') || task.includes('Doutrina') ? 'pink' : 'gray');
                    
                    if (isLaw) {
                        cardHtml += `
                            <details>
                                <summary>REFORÇO DA LEI: ${lawSubject}</summary>
                                <div class="details-content">
                                    <div class="item">
                                        <input type="checkbox" id="${id}" onchange="save()">
                                        <label for="${id}">Concluir leitura de <b>${lawSubject}</b> (${task.split('(')[1]})</label>
                                    </div>
                                </div>
                            </details>`;
                    } else {
                        cardHtml += `
                            <div class="item">
                                <input type="checkbox" id="${id}" onchange="save()">
                                <span class="box ${color}"></span>
                                <label for="${id}">${task}</label>
                            </div>`;
                    }
                });
                cardHtml += `</div>`;
            });
        }
        grid.innerHTML += cardHtml + `</div>`;
    }
    load();
}

function save() { document.querySelectorAll('input[type="checkbox"]').forEach(c => localStorage.setItem(c.id, c.checked)); updateProgress(); }

function load() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = localStorage.getItem(c.id) === 'true');
    document.getElementById('global-notes').value = localStorage.getItem('duo-notes') || '';
    updateProgress();
}

function saveNotes() { localStorage.setItem('duo-notes', document.getElementById('global-notes').value); }

function updateProgress() {
    const checks = document.querySelectorAll('input[type="checkbox"]');
    const done = Array.from(checks).filter(c => c.checked).length;
    const perc = Math.round((done / (checks.length || 1)) * 100) || 0;
    document.getElementById('main-bar').style.width = perc + '%';
    document.getElementById('perc-label').innerText = `${perc}% CONCLUÍDO`;
}

function exportProgress() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-estudos-duo.json`;
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

function clearAll() { if(confirm("Deseja apagar o progresso atual?")) { localStorage.clear(); location.reload(); } }

document.addEventListener('DOMContentLoaded', render);
