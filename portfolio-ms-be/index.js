import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { startPriceEngine } from './services/priceEngine.js';
import portfolioRoutes from './routes/portfolio.js';
import authRoutes from './routes/auth.js';

import { initSocket } from './services/socket.js';

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/auth', authRoutes);

initSocket(httpServer);

startPriceEngine();

app.get('/health', (req, res) => res.send('System Operational'));

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Portfolio Server running on port ${PORT}`);
});
