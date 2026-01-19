const totalSemanas = 54; // Conforme o Extensivo Inteligente [cite: 18-21]
const semanasPendencia = [5, 10, 15, 23, 28, 33, 41, 46, 51]; // Datas de respiro [cite: 235, 283, 331, 394, 422, 450, 497, 525, 553]

const materiasBase = {
    segunda: "Penal (Reforço + Metas + Questões)", [cite: 196]
    terca: "Constitucional & Humanos", [cite: 196]
    quarta: "Civil (Reforço + Metas + Questões)", [cite: 196]
    quinta: "Proc. Civil & ECA", [cite: 196]
    sexta: "Proc. Penal & Atualização Jurisprudencial", [cite: 196]
    sabado: "Revisão Semanal & Reforço Humanos" [cite: 196]
};

function gerarCronograma() {
    const container = document.getElementById('cronograma-container');
    
    for (let i = 1; i <= totalSemanas; i++) {
        const isPendencia = semanasPendencia.includes(i);
        
        let html = `
            <div class="semana-card ${isPendencia ? 'pendencia' : ''}">
                <h3 style="color: var(--verde-duo)">Semana ${i} ${isPendencia ? ' - ⚠️ SEMANA DE PENDÊNCIAS' : ''}</h3>
                <p><i>${isPendencia ? 'Momento de revisar o caderno de erros e notas produzidas[cite: 47].' : 'Siga a lista de metas e o reforço de lei[cite: 73].'}</i></p>
                
                <div class="meta-item">
                    <input type="checkbox" id="s${i}d1" onchange="salvar('s${i}d1', this.checked)">
                    <label>Segunda: ${materiasBase.segunda}</label>
                </div>
                <div class="meta-item">
                    <input type="checkbox" id="s${i}d2" onchange="salvar('s${i}d2', this.checked)">
                    <label>Terça: ${materiasBase.terca}</label>
                </div>
                <div class="meta-item">
                    <input type="checkbox" id="s${i}d3" onchange="salvar('s${i}d3', this.checked)">
                    <label>Quarta: ${materiasBase.quarta}</label>
                </div>
                <div class="meta-item">
                    <input type="checkbox" id="s${i}d4" onchange="salvar('s${i}d4', this.checked)">
                    <label>Quinta: ${materiasBase.quinta}</label>
                </div>
                <div class="meta-item">
                    <input type="checkbox" id="s${i}d5" onchange="salvar('s${i}d5', this.checked)">
                    <label>Sexta: ${materiasBase.sexta}</label>
                </div>
                <div class="meta-item">
                    <input type="checkbox" id="s${i}d6" onchange="salvar('s${i}d6', this.checked)">
                    <label>Sábado: ${materiasBase.sabado}</label>
                </div>
            </div>`;
        container.innerHTML += html;
    }
    carregarProgresso();
}

function salvar(id, status) { localStorage.setItem(id, status); }

function carregarProgresso() {
    const checks = document.querySelectorAll('input[type="checkbox"]');
    checks.forEach(c => {
        const status = localStorage.getItem(c.id);
        if (status === 'true') c.checked = true;
    });
}

gerarCronograma();
