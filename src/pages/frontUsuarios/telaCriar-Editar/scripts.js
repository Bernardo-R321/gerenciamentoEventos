const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

let inputNome = document.getElementById("nome");
let inputEmail = document.getElementById("email");
let inputSenha = document.getElementById("senha");
let form = document.getElementById("formulario");
let botoes = document.getElementsByClassName("button");

async function buscarDados() {
  let resposta = await fetch("http://177.44.248.46:3000/usuarios/" + id);

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

  let url = "http://177.44.248.46/:3000/usuarios";
  let method = "POST";
  if (id) {
    url += "/" + id;
    method = "PUT";
  }

  let resposta = await fetch(url, {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (resposta.ok) {
    if (method === "PUT") {
      alert(`Olá ${nome}, seu usuário foi EDITADO!`);
    } else {
      alert(`Olá ${nome}, seu usuário foi CRIADO!`);
    }
  } else {
    alert("Ops! Algo deu errado!");
  }
});
