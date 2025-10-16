import dotenv from 'dotenv';
import express from 'express';
import { corsMiddleware } from './middlewares/cors';
import authRoutes from './routes/auth.routes';
import favoritosRoutes from './routes/favoritos.routes';
import videosRoutes from './routes/videos.routes';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());

  app.use('/auth', authRoutes);
  app.use('/videos', videosRoutes);
  app.use('/favoritos', favoritosRoutes);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Erro:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  });

  return app;
}

if (require.main === module) {
  const PORTA = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORTA, () => {
    console.log(`🚀 Servidor Principal rodando em http://localhost:${PORTA}`);
    console.log(`🔐 Auth Service: ${process.env.AUTH_SERVICE_URL}`);
    console.log(`🎥 Videos Service: ${process.env.VIDEOS_SERVICE_URL}`);
    console.log(`⭐ Favoritos Service: ${process.env.FAVORITOS_SERVICE_URL}`);
  });
}
