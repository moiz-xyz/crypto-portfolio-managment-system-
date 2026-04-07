import axios from 'axios';
import { getIO } from './socket.js';
import 'dotenv/config';

export const startPriceEngine = () => {
    console.log('⚙️ Price Engine Started...');
    setInterval(async () => {
        try {
            const { data } = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price',
                {
                    params: {
                        ids: 'bitcoin,ethereum,solana',
                        vs_currencies: 'usd'
                    },
                    headers: {
                        'Accept': 'application/json',
                        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
                    }
                }
            );

            // Validation logic
            if (!data.bitcoin || !data.ethereum || !data.solana) {
                throw new Error('API response missing expected coin data');
            }

            const payload = {
                BTC: data.bitcoin.usd,
                ETH: data.ethereum.usd,
                SOL: data.solana.usd,
                timestamp: new Date().toISOString()
            };

            const io = getIO();
            io.emit('price-update', payload);
            console.log('Broadcasted BTC:', payload.BTC);

        } catch (error) {
            // 404 means the URL path is wrong; 401/403 means API Key is wrong
            console.error('❌ Price Engine Error:', error.response?.status || error.message);
        }
    }, 30000);
};

