let corpoTabela = document.getElementById('corpo-tabela');

function estiloDaLista() {
  let celulas = corpoTabela.querySelectorAll('td, th');
  celulas.forEach((cell) => {
    cell.style.padding = '10px';
    cell.style.border = '1px solid #fff';
  });
}

async function buscarInscricoes() {
  let resposta = await fetch('http://177.44.248.46:3000/inscricao');
  let inscricoes = await resposta.json();
  console.log(inscricoes);

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
    tdAcoes.innerHTML = `<button class="button red" onClick="excluir(${inscricao.id})">Cancelar inscrição</button>`;

    tr.appendChild(tdId);
    tr.appendChild(tdEvento);
    tr.appendChild(tdDataEvento);
    tr.appendChild(tdPresenca);
    tr.appendChild(tdSituacao);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
  }
  estiloDaLista();
}

async function excluir(id) {
  let confirma = confirm(
    'Deseja cancelar essa inscricao? Esta ação não pode ser revertida.'
  );
  if (confirma) {
    await fetch('http://177.44.248.46:3000/inscricao/' + id, {
      method: 'DELETE',
    });

    window.location.reload();
  }
}

buscarInscricoes();
