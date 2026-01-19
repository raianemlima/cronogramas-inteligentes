let currentMode = '8h1';
let currentPart = 1;
const alerts = [5, 10, 15, 23, 28, 33, 41, 46, 51];

// Banco de Dados do Reforço de Letra da Lei 
const lawData = {
    "Penal": ["Lei de Drogas", "Estatuto do Desarmamento (crimes)", "Lei de Crimes Hediondos", "Lei de Crimes Ambientais", "Crimes no ECA", "Lei da Tortura", "Lei de Abuso de Autoridade", "Crimes de Trânsito", "Lei do Preconceito Racial", "Lei 10.216/2001", "Código Penal (na ordem)"],
    "Constitucional": ["Mandado de Segurança", "Mandado de Injunção", "Súmula Vinculante", "Habeas Data", "Lei da ADI", "Lei da ADPF", "Constituição Federal", "Estatuto do Idoso", "Pessoa com Deficiência", "Estatuto das Cidades", "CDC"],
    "Civil": ["LINDB", "Código Civil (na ordem)", "Lei de Alimentos", "Alimentos Gravídicos", "Investigação de Paternidade", "Bem de Família", "Alienação Parental", "LGPD", "Marco Civil da Internet", "Registros Públicos", "Locações", "Falências"],
    "Processo Civil": ["CPC (na ordem)", "Juizados Especiais", "Juizados Fazenda Pública", "Lei da Mediação", "Ação Popular", "Ação Civil Pública", "Processo Eletrônico", "Regularização Fundiária", "LC 80/1994"],
    "Processo Penal": ["CPP (na ordem)", "Juizados Criminais", "Maria da Penha", "Prisão Temporária", "Organizações Criminosas", "Interceptação Telefônica", "Proteção à Vítima", "LEP", "Regras de Mandela", "Regras de Bangkok"],
    "Humanos": ["Revisar convenções já estudadas pela lista de Metas (na ordem)"],
    "ECA": ["ECA na ordem", "Lei do Sinase", "Sistema de Garantias", "LDB (Educação)", "LOAS", "Convenção da Criança", "Protocolos Facultativos", "Estatuto da Juventude"]
};

const config = {
    days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    modes: {
        '8h1': { label: '8h Opção 1', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "ECA"], tasks: ['Reforço Lei', 'Lista Metas', 'Questões'] },
        '8h2': { label: '8h Opção 2', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "Humanos"], tasks: ['Reforço Lei', 'Lista Metas', 'Questões'] },
        '6h1': { label: '6h Opção 1', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "ECA"], tasks: ['Reforço Lei', 'Lista Metas', 'Questões'] },
        '6h2': { label: '6h Opção 2', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "Humanos"], tasks: ['Reforço Lei', 'Lista Metas', 'Questões'] },
        '4h': { label: '4h Padrão', lawSubj: ["Processo Penal", "Constitucional", "Civil", "Processo Civil", "Penal", "Humanos"], tasks: ['Reforço Lei', 'Lista Metas', 'Questões'] },
        '3h': { label: '3h Padrão', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "Revisão"], tasks: ['Reforço Lei', 'Lista Metas', 'Questões'] }
    }
};

function switchPart(p) { currentPart = p; document.querySelectorAll('.part-btn').forEach((b, i) => b.classList.toggle('active', i+1 === p)); render(); }
function changeSchedule() { currentMode = document.getElementById('mode-select').value; render(); }

function render() {
    const grid = document.getElementById('content-grid');
    grid.innerHTML = '';
    const start = (currentPart - 1) * 18 + 1;
    const end = currentPart * 18;

    for (let i = start; i <= end; i++) {
        const isA = alerts.includes(i);
        const mode = config.modes[currentMode];
        let cardHtml = `<div class="card-study ${isA ? 'alerta-rev' : ''}"><span class="week-id">SEMANA ${i}</span><h4>${isA ? '⚠️ ALERTA REVISÃO' : 'CRONOGRAMA ATIVO'}</h4>`;
        if (isA) { cardHtml += `<div class="day-box"><p style="font-size:13px; color:#FF1744; font-weight:600">PARE TUDO: Revise o caderno de erros e metas do bloco anterior antes de seguir.</p></div>`; }
        else {
            config.days.forEach((day, idx) => {
                const subj = mode.lawSubj[idx];
                cardHtml += `<div class="day-box"><span class="day-title">${day}</span>`;
                mode.tasks.forEach(task => {
                    const id = `${currentMode}-w${i}-d${idx}-${task}`;
                    if (task === 'Reforço Lei' && lawData[subj]) {
                        cardHtml += `<details><summary><input type="checkbox" id="${id}" onchange="save()" ${localStorage.getItem(id) === 'true' ? 'checked' : ''}> REFORÇO DA LEI: ${subj}</summary><div class="lei-list">${lawData[subj].map(l => `<span class="lei-item">• ${l}</span>`).join('')}</div></details>`;
                    } else {
                        const color = task === 'Lista Metas' ? 'pink' : 'gray';
                        cardHtml += `<div class="item"><input type="checkbox" id="${id}" onchange="save()" ${localStorage.getItem(id) === 'true' ? 'checked' : ''}><span class="box ${color}"></span><label for="${id}">${task}: ${subj}</label></div>`;
                    }
                });
                cardHtml += `</div>`;
            });
        }
        grid.innerHTML += cardHtml + `</div>`;
    }
    updateProgress();
}

function save() { document.querySelectorAll('input[type="checkbox"]').forEach(c => localStorage.setItem(c.id, c.checked)); updateProgress(); }
function saveNotes() { localStorage.setItem('duo-notes', document.getElementById('global-notes').value); }
function updateProgress() {
    const checks = document.querySelectorAll('input[type="checkbox"]');
    const done = Array.from(checks).filter(c => c.checked).length;
    const perc = Math.round((done / (checks.length || 1)) * 100);
    document.getElementById('main-bar').style.width = perc + '%';
    document.getElementById('perc-label').innerText = `${perc}% CONCLUÍDO`;
}
function exportProgress() { const data = JSON.stringify(localStorage); const blob = new Blob([data], { type: "application/json" }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup-duo.json`; a.click(); }
function importProgress(input) { const reader = new FileReader(); reader.onload = () => { const data = JSON.parse(reader.result); Object.keys(data).forEach(k => localStorage.setItem(k, data[k])); location.reload(); }; reader.readAsText(input.files[0]); }
function clearAll() { if(confirm("Deseja apagar o progresso?")) { localStorage.clear(); location.reload(); } }
document.addEventListener('DOMContentLoaded', () => { document.getElementById('global-notes').value = localStorage.getItem('duo-notes') || ''; render(); });
