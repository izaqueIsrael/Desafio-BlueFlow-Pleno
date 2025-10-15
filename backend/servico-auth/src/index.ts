import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.listen(PORTA, () => {
  console.log(`🔐 Serviço de Autenticação rodando em http://localhost:${PORTA}`);
});
