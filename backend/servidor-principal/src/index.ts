import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// FIXME: Rotas serão adicionadas aqui
// app.use('/auth', authRoutes);
// app.use('/videos', videosRoutes);
// app.use('/favoritos', favoritosRoutes);

app.listen(PORTA, () => {
  console.log(`🚀 Servidor Principal rodando em http://localhost:${PORTA}`);
});
