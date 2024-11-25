require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Certifique-se de que a rota existe
const PORT = process.env.PORT || 4000;

const app = express();

// Middlewares
app.use(cors()); // Habilita o CORS
app.use(express.json()); // Processa JSON no corpo da requisição

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado!'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));
  
// Definindo as rotas
app.use('/api', userRoutes); // Certifique-se que o arquivo de rotas userRoutes.js está corretamente configurado

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
