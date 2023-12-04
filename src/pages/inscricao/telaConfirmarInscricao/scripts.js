const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
localStorage.setItem('idUsuario', '1'); ///Remover depois que a autenticação estiver funcionando 100%
const usuarioLogado = localStorage.getItem('idUsuario');

let inputNome = document.getElementById('nome');
let inputDescricao = document.getElementById('descricao');
let inputData = document.getElementById('data');
let inputCidade = document.getElementById('cidade');
let form = document.getElementById('formulario');
let botao = document.getElementsByClassName('button');

async function buscarDados() {
  let resposta = await fetch('http://177.44.248.46:3000/evento/' + id);

  if (resposta.ok) {
    let evento = await resposta.json();
    inputNome.value = evento.nome;
    inputDescricao.value = evento.descricao;
    inputData.value = evento.data_evento;
    inputCidade.value = evento.cidade;
  } else if (resposta.status === 422) {
    let e = await resposta.json();
    alert(e.error);
  } else {
    alert('Ops! Algo deu errado!');
  }
}

if (id) {
  buscarDados();
}

form.addEventListener('submit', async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let payload = {
    idEvento: id,
    idUsuario: usuarioLogado,
  };

  let resposta = await fetch('http://177.44.248.46:3000/inscricao', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (resposta.ok) {
    alert('Inscrição confirmada com sucesso!');
  } else {
    console.log(resposta);
    alert('Ops, algo deu errado!');
  }
});

botao[0].addEventListener('click', () => {
  window.location.href = '../telaListar/index.html';
});
