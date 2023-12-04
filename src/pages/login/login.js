document.getElementById("form").addEventListener('submit', async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let email = document.getElementById("email").value;
  let senha = document.getElementById("senha").value;

  let payload = {
    email,
    senha
  }

  let url = 'http://177.44.248.46:3000/usuarios/login';
  let method = 'POST';

  let resposta = await fetch(url, {
    method: method,
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  console.log(resposta);

  if (resposta.ok) {
    window.location.href = '../index.html' // Autenticado, tela inicial
    let dados = await resposta.json();
    localStorage.setItem('authorization', `${dados.type} ${dados.token}`);
    
  } else {
    alert('Usuário ou senha incorretos!');
  }
});
