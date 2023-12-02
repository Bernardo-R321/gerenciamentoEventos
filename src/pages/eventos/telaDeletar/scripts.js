const urlParams = new URLSearchParams(window.location.search);
const idInvalido = urlParams.get("id");

const id = parseInt(idInvalido);

async function buscarDados() {
  let resposta = await fetch(`http://localhost:3000/usuarios/${id}`);
  if (resposta.ok) {
    let usuario = await resposta.json();
    inputNome.value = usuario.nome;
    inputEmail.value = usuario.email;
    inputSenha.value = usuario.senha;
  } else if (resposta.status === 422) {
    let e = await resposta.json();
    alert(e.error);
  } else {
    alert("Ops! Algo deu errado!");
  }
}

if (id) {
  buscarDados();
}

let inputNome = document.getElementById("nome");
let inputEmail = document.getElementById("email");
let inputSenha = document.getElementById("senha");
let form = document.getElementById("formulario");

form.addEventListener("submit", async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let nome = inputNome.value;
  let email = inputEmail.value;
  let senha = inputSenha.value;

  let payload = {
    nome,
    email,
    senha,
  };

  let url = `http://localhost:3000/usuarios/${id}`;
  let method = "DELETE";

  let resposta = await fetch(url, {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (resposta.ok) {
    alert(`Olá ${nome}, seu usuário foi DELETADO!`);
  } else {
    alert("Ops! Algo deu errado!");
  }
});
