const ACCESS_KEY = "DUO2026";
let currentMode = '8h1';
let currentPart = 1;
const alerts = [5, 10, 15, 23, 28, 33, 41, 46, 51]; //

// Banco de Dados do Reforço da Lei
const lawDatabase = {
    "Penal": ["Lei de Drogas", "Estatuto do Desarmamento", "Lei de Crimes Hediondos", "Lei de Crimes Ambientais", "Crimes no ECA", "Lei da Tortura", "Lei de Abuso de Autoridade", "Crimes de Trânsito", "Lei do Preconceito Racial", "Código Penal"],
    "Constitucional": ["Mandado de Segurança", "Mandado de Injunção", "Súmula Vinculante", "Habeas Data", "Lei da ADI", "Lei da ADPF", "Constituição Federal", "Estatuto do Idoso", "CDC"],
    "Civil": ["LINDB", "Código Civil", "Lei de Alimentos", "Investigação de Paternidade", "Bem de Família", "Alienação Parental", "LGPD", "Marco Civil da Internet", "Registros Públicos", "Locações"],
    "Processo Civil": ["CPC", "Juizados Especiais", "Juizados Fazenda Pública", "Lei da Mediação", "Ação Popular", "Ação Civil Pública", "Processo Eletrônico", "LC 80/1994"],
    "Processo Penal": ["CPP", "Juizados Criminais", "Maria da Penha", "Prisão Temporária", "Organizações Criminosas", "Interceptação Telefônica", "LEP", "Regras de Mandela"],
    "ECA": ["ECA", "Lei do Sinase", "Sistema de Garantias", "LDB", "LOAS", "Convenção da Criança", "Estatuto da Juventude"],
    "Humanos": ["Declaração Universal", "Pacto de San José", "Protocolo de San Salvador", "Convenção CEDAW", "Convenção Belém do Pará"]
};

// Configuração com tempos extraídos dos arquivos
const config = {
    days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    modes: {
        '8h1': { label: '8h Opção 1', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "ECA"], tasks: [{n:'Atividade 1', t:'1h'}, {n:'Reforço Lei', t:'3h'}, {n:'Lista Metas', t:'2h30min'}, {n:'Questões', t:'1h30min'}] },
        '8h2': { label: '8h Opção 2', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "Humanos"], tasks: [{n:'Atividade 1', t:'1h'}, {n:'Reforço Lei', t:'3h'}, {n:'Lista Metas', t:'2h30min'}, {n:'Questões', t:'1h30min'}] },
        '6h1': { label: '6h Opção 1', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "ECA"], tasks: [{n:'Reforço Lei', t:'50min'}, {n:'Lista Metas', t:'2h30min'}, {n:'Questões', t:'1h30min'}, {n:'Questões do Dia', t:'40min'}] },
        '6h2': { label: '6h Opção 2', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "Humanos"], tasks: [{n:'Reforço Lei', t:'40min'}, {n:'Lista Metas', t:'2h30min'}, {n:'Questões', t:'1h'}, {n:'Jurisprudência', t:'2h'}] },
        '4h': { label: '4h Padrão', lawSubj: ["Processo Penal", "Constitucional", "Civil", "Processo Civil", "Penal", "Humanos"], tasks: [{n:'Reforço Lei', t:'30min'}, {n:'Lista Metas', t:'1h30min'}, {n:'Questões', t:'1h30min'}] },
        '3h': { label: '3h Padrão', lawSubj: ["Penal", "Constitucional", "Civil", "Processo Civil", "Processo Penal", "ECA"], tasks: [{n:'Lista Metas', t:'1h30min'}, {n:'Questões', t:'1h30min'}] }
    }
};

function checkAccess() {
    if (localStorage.getItem('access_granted') === 'true') {
        document.getElementById('app-body').style.display = 'block';
        render();
    } else {
        let input = prompt("Digite a chave de acesso DUO:");
        if (input === ACCESS_KEY) {
            localStorage.setItem('access_granted', 'true');
            document.getElementById('app-body').style.display = 'block';
            render();
        } else {
            alert("Acesso negado.");
            window.location.reload();
        }
    }
}

function switchPart(p) { currentPart = p; document.querySelectorAll('.part-btn').forEach((b, i) => b.classList.toggle('active', i+1 === p)); render(); }
function changeSchedule() { currentMode = document.getElementById('mode-select').value; render(); }

function render() {
    const grid = document.getElementById('content-grid');
    grid.innerHTML = '';
    const start = (currentPart - 1) * 18 + 1; //
    const end = currentPart * 18;

    for (let i = start; i <= end; i++) {
        const isA = alerts.includes(i);
        const mode = config.modes[currentMode];
        let cardHtml = `<div class="card-study ${isA ? 'alerta-rev' : ''}"><span class="week-id">SEMANA ${i}</span><h4>${isA ? 'ALERTA REVISÃO' : 'METAS DIÁRIAS'}</h4>`;
        
        if (isA) {
            cardHtml += `<div class="day-box"><p style="font-size:13px; color:#FF1744; font-weight:600">PARE TUDO: Revise o caderno de erros e as metas do bloco anterior antes de seguir.</p></div>`;
        } else {
            config.days.forEach((day, idx) => {
                const subj = mode.lawSubj[idx];
                cardHtml += `<div class="day-box"><span class="day-title">${day}</span>`;
                mode.tasks.forEach((task, tIdx) => {
                    const baseId = `${currentMode}-w${i}-d${idx}-${task.n}`;
                    if (task.n === 'Reforço Lei' && lawDatabase[subj]) {
                        cardHtml += `<details><summary>REFORÇO LEI: ${subj} <span class="time-tag">(${task.t})</span></summary><div class="lei-checklist">${lawDatabase[subj].map((l, lIdx) => { const sId = `${baseId}-l${lIdx}`; return `<div class="lei-item"><input type="checkbox" id="${sId}" onchange="save()" ${localStorage.getItem(sId) === 'true' ? 'checked' : ''}><label for="${sId}">${l}</label></div>`; }).join('')}</div></details>`;
                    } else {
                        const color = task.n.includes('Metas') ? 'pink' : (task.n.includes('Quest') ? 'gray' : 'blue');
                        cardHtml += `<div class="item"><input type="checkbox" id="${baseId}" onchange="save()" ${localStorage.getItem(baseId) === 'true' ? 'checked' : ''}><span class="box ${color}"></span><label for="${baseId}">${task.n}: ${subj}</label><span class="time-tag">(${task.t})</span></div>`;
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
function updateProgress() { const checks = document.querySelectorAll('input[type="checkbox"]'); const done = Array.from(checks).filter(c => c.checked).length; const perc = Math.round((done / (checks.length || 1)) * 100); document.getElementById('main-bar').style.width = perc + '%'; document.getElementById('perc-label').innerText = `${perc}% CONCLUÍDO`; }
function saveNotes() { localStorage.setItem('duo-notes', document.getElementById('global-notes').value); }
function exportProgress() { const data = JSON.stringify(localStorage); const blob = new Blob([data], { type: "application/json" }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `progresso-duo.json`; a.click(); }
function importProgress(input) { const r = new FileReader(); r.onload = () => { const d = JSON.parse(r.result); Object.keys(d).forEach(k => localStorage.setItem(k, d[k])); location.reload(); }; r.readAsText(input.files[0]); }
function clearAll() { if(confirm("Deseja apagar tudo?")) { localStorage.clear(); location.reload(); } }
document.addEventListener('DOMContentLoaded', () => { document.getElementById('global-notes').value = localStorage.getItem('duo-notes') || ''; checkAccess(); });
