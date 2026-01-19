let parteAtual = 1;
const semanasPendencia = [5, 10, 15, 23, 28, 33, 41, 46, 51]; [cite: 1753-1756]

function mudarParte(p) {
    parteAtual = p;
    document.querySelectorAll('.btn-part').forEach((b, i) => {
        b.classList.toggle('active', i + 1 === p);
    });
    renderizar();
}

function renderizar() {
    const container = document.getElementById('app-container');
    container.innerHTML = '';
    
    // Define o intervalo de semanas baseado na Parte 
    const inicio = (parteAtual - 1) * 18 + 1;
    const fim = parteAtual * 18;

    for (let i = inicio; i <= fim; i++) {
        const isPendencia = semanasPendencia.includes(i);
        container.innerHTML += `
            <div class="card-tech ${isPendencia ? 'bloco-rosa' : 'bloco-verde'}">
                <div style="display:flex; justify-content:space-between">
                    <span style="font-size: 12px; color: var(--azul-tech)">WEEKLY MISSION</span>
                    <span style="font-weight:800">#${i}</span>
                </div>
                <h3 style="margin: 10px 0">${isPendencia ? 'REVISÃO DE PENDÊNCIAS' : 'CRONOGRAMA ATIVO'}</h3>
                
                ${gerarMeta(i, "Lei", "Reforço de Letra da Lei", "verde")}
                ${gerarMeta(i, "Meta", "Lista de Metas (Doutrina)", "verde")}
                ${gerarMeta(i, "Quest", "Questões (Filtro DPE)", "azul")}
                ${isPendencia ? '<p style="color:var(--rosa-tech); font-size:11px">! Alerta Revisão: Caderno de Erros [cite: 1757]</p>' : ''}
            </div>
        `;
    }
    carregar();
}

function gerarMeta(sem, tipo, texto, bloco) {
    const id = `s${sem}${tipo}`;
    return `
        <div class="meta-row bloco-${bloco}">
            <input type="checkbox" id="${id}" onchange="atualizar('${id}', this.checked)">
            <label for="${id}" style="font-size:13px">${texto}</label>
        </div>
    `;
}

function atualizar(id, status) {
    localStorage.setItem(id, status);
    const checks = document.querySelectorAll('input[type="checkbox"]');
    const marcados = Array.from(checks).filter(c => c.checked).length;
    const porc = Math.round((marcados / checks.length) * 100);
    document.getElementById('fill').style.width = porc + '%';
    document.getElementById('status').innerText = `${porc}% SYNCED`;
}

function carregar() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        c.checked = localStorage.getItem(c.id) === 'true';
    });
}

document.addEventListener('DOMContentLoaded', () => mudarParte(1));
