import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/saude', (req, res) => {
  res.json({ 
    status: 'online',
    servico: 'servidor-principal',
    mensagem: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORTA, () => {
  console.log(`🚀 Servidor Principal rodando em http://localhost:${PORTA}`);
});
