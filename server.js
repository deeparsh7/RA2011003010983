const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/', (req, res) => {
    res.send('Welcome to the number management service!');
});

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;
    
    if (!urls || urls.length === 0) {
        return res.status(400).send({ error: 'No URL parameters provided.' });
    }

    const fetchNumbers = url => axios.get(url, { timeout: 500 }).then(response => response.data.numbers).catch(() => []);

    const allPromises = urls.map(url => fetchNumbers(url));
    
    try {
        const allNumbers = await Promise.all(allPromises);
        const merged = [].concat(...allNumbers);
        const uniqueSorted = Array.from(new Set(merged)).sort((a, b) => a - b);

        res.send({ numbers: uniqueSorted });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch numbers.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
