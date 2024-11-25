async function registerUser() {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'novoUsuario',
        password: 'senhaSegura'
      });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
  }
  