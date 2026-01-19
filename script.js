const totalSemanas = 54;
const container = document.getElementById('cronograma-container');

function gerar() {
    for (let i = 1; i <= totalSemanas; i++) {
        const parte = i <= 18 ? 1 : (i <= 36 ? 2 : 3); // Divisão em 3 partes 
        const isPendencia = [5, 10, 15, 23, 28, 33, 41, 46, 51].includes(i); // Semanas de respiro [cite: 43]
        
        let card = document.createElement('div');
        card.className = `semana-card ${isPendencia ? 'pendencia' : ''}`;
        
        card.innerHTML = `
            <span class="parte-tag" style="background: ${parte === 1 ? '#2ecc71' : (parte === 2 ? '#3498db' : '#e91e63')}">
                PARTE ${parte}
            </span>
            <h3>Semana ${i} ${isPendencia ? '⚠️ PENDÊNCIAS' : ''}</h3>
            ${isPendencia ? '<p><i>Semana para colocar o estudo em dia e revisar o caderno de erros.</i></p>' : ''}
            
            <div class="item-meta">
                <input type="checkbox" id="s${i}L" onchange="atualizar()">
                <label><span class="bloco-verde">Reforço de Lei:</span> Penal, Const, Civil e Proc. Civil</label>
            </div>
            <div class="item-meta">
                <input type="checkbox" id="s${i}M" onchange="atualizar()">
                <label><span class="bloco-rosa">Metas:</span> Doutrina e Jurisprudência</label>
            </div>
            <div class="item-meta">
                <input type="checkbox" id="s${i}Q" onchange="atualizar()">
                <label><span class="bloco-azul">Questões:</span> Treino diário conforme a meta</label>
            </div>
        `;
        container.appendChild(card);
    }
    carregar();
}

function atualizar() {
    const todos = document.querySelectorAll('input[type="checkbox"]');
    let marcados = 0;
    todos.forEach(c => {
        localStorage.setItem(c.id, c.checked);
        if(c.checked) marcados++;
    });
    
    const porc = Math.round((marcados / todos.length) * 100);
    document.getElementById('progress').style.width = porc + '%';
    document.getElementById('status-txt').innerText = porc + '% concluído';
}

function carregar() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        c.checked = localStorage.getItem(c.id) === 'true';
    });
    atualizar();
}

gerar();
