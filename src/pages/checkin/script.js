let select = document.getElementById('selectEvento');
let inputEmail = document.getElementById('inputEmail');
let buttonPesquisar = document.getElementById('botaoPesquisar');
let corpoTabela = document.getElementById('corpo-tabela');

async function buscarEventos() {
  let resposta = await fetch('http://localhost:3000/evento');
  let eventos = await resposta.json();

  for (let evento of eventos) {
    let opEvento = document.createElement('option');
    opEvento.value = evento.id;
    opEvento.text = evento.nome;
    select.appendChild(opEvento);
  }
}

buttonPesquisar.addEventListener('click', async () => {
  let payload = {
    idEvento: select.value,
    email: inputEmail.value,
  };
  console.log(payload);
  let resposta = await fetch('http://localhost:3000/encontrarInscricao', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let inscricoes = await resposta.json();

  for (let inscricao of inscricoes) {
    let tr = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdEvento = document.createElement('td');
    let tdDataEvento = document.createElement('td');
    let tdPresenca = document.createElement('td');
    let tdSituacao = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.innerText = inscricao.id;
    tdEvento.innerText = inscricao.evento.nome;
    tdDataEvento.innerText = inscricao.evento.data_evento;
    tdPresenca.innerText = inscricao.confirmacao;
    tdSituacao.innerText = inscricao.situacao;
    tdAcoes.innerHTML = `<button class="button green" onClick="confirmar(${inscricao.id})">Confirmar Presença</button>`;

    tr.appendChild(tdId);
    tr.appendChild(tdEvento);
    tr.appendChild(tdDataEvento);
    tr.appendChild(tdPresenca);
    tr.appendChild(tdSituacao);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
  }
  estiloDaLista();
});

function estiloDaLista() {
  let celulas = corpoTabela.querySelectorAll('td, th');
  celulas.forEach((cell) => {
    cell.style.padding = '10px';
    cell.style.border = '1px solid #fff';
  });
}

async function confirmar(id) {
  let resposta = await fetch('http://localhost:3000/confirmarInscricao/' + id, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  console.log(resposta);
}

buscarEventos();
