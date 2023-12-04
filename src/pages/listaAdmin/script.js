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
  let id = select.value;
  let resposta = await fetch('http://localhost:3000/inscricaoPorEvento/' + id, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
  });

  let inscricoes = await resposta.json();

  for (let inscricao of inscricoes) {
    let tr = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdUsuario = document.createElement('td');
    let tdEvento = document.createElement('td');
    let tdDataEvento = document.createElement('td');
    let tdPresenca = document.createElement('td');
    let tdSituacao = document.createElement('td');

    tdId.innerText = inscricao.id;
    tdUsuario.innerText = inscricao.usuario.nome;
    tdEvento.innerText = inscricao.evento.nome;
    tdDataEvento.innerText = inscricao.evento.data_evento;
    tdPresenca.innerText = inscricao.confirmacao;
    tdSituacao.innerText = inscricao.situacao;

    tr.appendChild(tdId);
    tr.appendChild(tdUsuario);
    tr.appendChild(tdEvento);
    tr.appendChild(tdDataEvento);
    tr.appendChild(tdPresenca);
    tr.appendChild(tdSituacao);

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

buscarEventos();
