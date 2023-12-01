let corpoTabela = document.getElementById("corpo-tabela");

function estiloDaLista() {
  let celulas = corpoTabela.querySelectorAll('td, th');
  celulas.forEach(cell => {
    cell.style.padding = '10px';
    cell.style.border = '1px solid #fff'; 
  });
}

async function buscarUsuarios() {
  let resposta = await fetch("http://localhost:3000/usuarios");
  let usuarios = await resposta.json();

  for (let usuario of usuarios) {
    let tr = document.createElement("tr");
    let tdNome = document.createElement("td");
    let tdEmail = document.createElement("td");
    let tdSenha = document.createElement("td");
    let tdAcoes = document.createElement("td");

    tdNome.innerText = usuario.nome;
    tdEmail.innerText = usuario.email;
    tdSenha.innerText = "Senha criptografada";
    tdAcoes.innerHTML = `
      <a class="button darkblue" href="../telaCriar-Editar/index.html?id=${usuario.id}">Editar</a>
      <a class="button red" href="../telaDeletar/index.html?id=${usuario.id}">Excluir</a>
    `;


    tr.appendChild(tdNome);
    tr.appendChild(tdEmail);
    tr.appendChild(tdSenha);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
  }
  estiloDaLista();
}

buscarUsuarios();
