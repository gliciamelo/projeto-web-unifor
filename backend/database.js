const mongoose = require('mongoose');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Conectado ao MongoDB"))
.catch((error) => console.error("Erro ao conectar ao MongoDB:", error));
