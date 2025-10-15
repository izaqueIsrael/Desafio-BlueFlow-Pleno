import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// app.get('/saude', (req, res) => {
//   res.json({ 
//     status: 'online',
//     servico: 'servico-videos',
//     timestamp: new Date().toISOString()
//   });
// });

app.listen(PORTA, () => {
  console.log(`🎥 Serviço de Vídeos rodando em http://localhost:${PORTA}`);
});
