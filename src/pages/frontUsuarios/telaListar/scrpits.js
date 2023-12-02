let corpoTabela = document.getElementById("corpo-tabela");

function estiloDaLista() {
  let celulas = corpoTabela.querySelectorAll("td, th");
  celulas.forEach((cell) => {
    cell.style.padding = "10px";
    cell.style.border = "1px solid #fff";
  });
}

async function buscarUsuarios() {
  let resposta = await fetch("http://localhost:3000/usuarios");
  let usuarios = await resposta.json();

  if (usuarios.length > 0) {
    for (let usuario of usuarios) {
      //cria elementos e adiciona texto e código
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
  } else {
    // mesnsagem caso não haja usuários no banco
    let tr = document.createElement("tr");
    let tdMensagem = document.createElement("td");
    //colspan ocupa todas as células da table
    tdMensagem.setAttribute("colspan", "4"); 
    tdMensagem.innerText = 'Não há usuários no banco!';

    tdMensagem.style.textAlign = "center";
    tdMensagem.style.verticalAlign = "middle";
    tdMensagem.style.height = "100px"; 

    tr.appendChild(tdMensagem);
    corpoTabela.appendChild(tr);
  }
  estiloDaLista();
}

buscarUsuarios();
