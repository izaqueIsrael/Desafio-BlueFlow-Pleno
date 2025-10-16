import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORTA, () => {
  console.log(`🔐 Serviço de Autenticação rodando em http://localhost:${PORTA}`);
});
