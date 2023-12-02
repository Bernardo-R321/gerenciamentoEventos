const urlParams = new URLSearchParams(window.location.search);
const idInvalido = urlParams.get("id");

const id = parseInt(idInvalido);

if (!id || isNaN(id)) {
  alert("ID inválido!");
  // Você pode redirecionar o usuário para uma página de erro ou ação apropriada aqui
}

async function buscarDados() {
  try {
    let resposta = await fetch(`http://localhost:3000/usuarios/${id}`);
    if (resposta.ok) {
      let usuario = await resposta.json();
      inputNome.value = usuario.nome;
      inputEmail.value = usuario.email;
      inputSenha.value = usuario.senha;
    } else {
      let e = await resposta.json();
      alert(e.error || "Ops! Algo deu errado!");
    }
  } catch (erro) {
    console.error("Erro ao buscar dados do usuário:", erro);
    alert("Ops! Algo deu errado!");
  }
}

if (id) {
  buscarDados();
}

let inputNome = document.getElementById("nome");
let inputEmail = document.getElementById("email");
let form = document.getElementById("formulario");

form.addEventListener("submit", async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let confirmacao = window.confirm(`Tem certeza que deseja deletar o usuário?`);
  
  if (!confirmacao) {
    return; 
  }

  let nome = inputNome.value;
  let email = inputEmail.value;

  let url = `http://localhost:3000/usuarios/${id}`;
  let method = "DELETE";

  try {
    let resposta = await fetch(url, {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    });

    if (resposta.ok) {
      alert(`Olá ${nome}, seu usuário foi DELETADO!`);
    } else {
      let e = await resposta.json();
      alert(e.error || "Ops! Algo deu errado!");
    }
  } catch (erro) {
    console.error("Erro ao tentar excluir o usuário:", erro);
    alert("Ops! Algo deu errado!");
  }
});
