// server.js

import express from 'express';
import ipcaRoutes from './routes/ipcaRoutes.js';

const app = express();
const PORT = 8080;

app.use(ipcaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
