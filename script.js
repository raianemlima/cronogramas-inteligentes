const totalSemanas = 54; // Conforme o plano do curso [cite: 18-21]

function gerarCronograma() {
    const container = document.getElementById('cronograma-container');
    
    for (let i = 1; i <= totalSemanas; i++) {
        const isPendencia = [5, 10, 15, 23, 28, 33, 41, 46, 51].includes(i); // Semanas de "respiro" [cite: 235, 283, 331, 394, 422, 450, 497, 525, 553]
        
        let html = `
            <div class="semana-card ${isPendencia ? 'pendencia' : ''}">
                <h3>Semana ${i} ${isPendencia ? '- PENDÊNCIAS' : ''}</h3>
                <div class="meta-item">
                    <input type="checkbox" id="sem${i}-lei" onchange="salvar('${i}-lei', this.checked)">
                    <label>Reforço de Letra da Lei</label> [cite: 71]
                </div>
                <div class="meta-item">
                    <input type="checkbox" id="sem${i}-meta" onchange="salvar('${i}-meta', this.checked)">
                    <label>Lista de Metas (Doutrina)</label> [cite: 158]
                </div>
                <div class="meta-item">
                    <input type="checkbox" id="sem${i}-quest" onchange="salvar('${i}-quest', this.checked)">
                    <label>Resolução de Questões</label> [cite: 161]
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
        const status = localStorage.getItem(c.id.replace('sem',''));
        if (status === 'true') c.checked = true;
    });
}

gerarCronograma();