import dotenv from 'dotenv';
import express from 'express';
import { corsMiddleware } from './middlewares/cors';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORTA, () => {
  console.log(`🚀 Servidor Principal rodando em http://localhost:${PORTA}`);
  console.log(`🔐 Auth Service: ${process.env.AUTH_SERVICE_URL}`);
  console.log(`🎥 Videos Service: ${process.env.VIDEOS_SERVICE_URL}`);
  console.log(`⭐ Favoritos Service: ${process.env.FAVORITOS_SERVICE_URL}`);
});