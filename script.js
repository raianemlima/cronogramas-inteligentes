let currentPart = 1;
const totalSemanas = 54; // [cite: 1731]
const pendenciaWeeks = [5, 10, 15, 23, 28, 33, 41, 46, 51]; // [cite: 1753]

function switchPart(p) {
    currentPart = p;
    document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i + 1 === p));
    render();
}

function render() {
    const grid = document.getElementById('schedule-grid');
    grid.innerHTML = '';
    
    // Calcula intervalo da parte [cite: 1729-1731]
    const start = (currentPart - 1) * 18 + 1;
    const end = currentPart * 18;

    for (let i = start; i <= end; i++) {
        const isPendencia = pendenciaWeeks.includes(i);
        const card = document.createElement('div');
        card.className = `card ${isPendencia ? 'pendencia-card' : ''}`;
        
        card.innerHTML = `
            <div class="card-h">
                <span class="week-badge">S${i}</span>
                <span style="font-size:10px; color:var(--v-glow)">${isPendencia ? 'SYSTEM RECOVERY' : 'ACTIVE SESSION'}</span>
            </div>
            <h4 style="margin:0 0 15px 0">${isPendencia ? 'SEMANA DE PENDÊNCIAS' : 'CRONOGRAMA DE METAS'}</h4>
            
            ${item(i, 'Lei', 'Reforço de Lei [cite: 1781]', 'verde')}
            ${item(i, 'Meta', 'Lista de Metas [cite: 1868]', 'verde')}
            ${item(i, 'Quest', 'Questões Diárias [cite: 1871]', 'azul')}
            ${isPendencia ? '<div style="font-size:11px; color:var(--r-glow); margin-top:10px">► Alerta Revisão: Caderno de Erros [cite: 1757]</div>' : ''}
        `;
        grid.appendChild(card);
    }
    load();
}

function item(sem, tipo, texto, bloco) {
    const id = `w${sem}${tipo}`;
    return `
        <div class="meta-item border-${bloco}">
            <input type="checkbox" id="${id}" onchange="save('${id}', this.checked)">
            <label for="${id}" style="font-size:13px; cursor:pointer">${texto}</label>
        </div>
    `;
}

function save(id, state) {
    localStorage.setItem(id, state);
    updateProgress();
}

function updateProgress() {
    const all = document.querySelectorAll('input[type="checkbox"]');
    const checked = Array.from(all).filter(c => localStorage.getItem(c.id) === 'true').length;
    // O progresso é baseado no total de 54 semanas para ser real
    const totalChecks = totalSemanas * 3; 
    const porc = Math.round((checked / totalChecks) * 100) || 0;
    
    document.getElementById('main-bar').style.width = porc + '%';
    document.getElementById('perc-txt').innerText = `${porc}% SYNCED`;
}

function load() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        c.checked = localStorage.getItem(c.id) === 'true';
    });
    updateProgress();
}

document.addEventListener('DOMContentLoaded', () => switchPart(1));
