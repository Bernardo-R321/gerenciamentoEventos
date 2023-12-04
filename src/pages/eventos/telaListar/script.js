let corpoTabela = document.getElementById('corpo-tabela');

function estiloDaLista() {
  let celulas = corpoTabela.querySelectorAll('td, th');
  celulas.forEach((cell) => {
    cell.style.padding = '10px';
    cell.style.border = '1px solid #fff';
  });
}

async function buscarEventos() {
  let resposta = await fetch('http://177.44.248.46:3000/evento');
  let eventos = await resposta.json();
  console.log(eventos);

  for (let evento of eventos) {
    let tr = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdDescricao = document.createElement('td');
    let tdDataEvento = document.createElement('td');
    let tdCidade = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.innerText = evento.id;
    tdNome.innerText = evento.nome;
    tdDescricao.innerText = evento.descricao;
    tdDataEvento.innerText = evento.data_evento;
    tdCidade.innerText = evento.cidade;
    tdAcoes.innerHTML = `
      <a class="button darkblue" href="../telaCriar-Editar/index.html?id=${evento.id}">Editar</a>
      <button class="button red" onClick="excluir(${evento.id})">Excluir</button>
    `;

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdDescricao);
    tr.appendChild(tdDataEvento);
    tr.appendChild(tdCidade);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
  }
  estiloDaLista();
}

async function excluir(id) {
  let confirma = confirm(
    'Deseja excluir esse evento? Esta ação não pode ser revertida.'
  );
  if (confirma) {
    await fetch('http://177.44.248.46/evento/' + id, {
      method: 'DELETE',
    });

    window.location.reload();
  }
}

buscarEventos();
