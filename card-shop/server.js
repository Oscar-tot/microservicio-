const express = require('express');
const redis = require('./redisClient');

const app = express();
app.use(express.json());

const port = 3000;

const cards = [
  { id: 1, name: 'Golden Dragon', price: 100 },
  { id: 2, name: 'Silver Unicorn', price: 80 },
  { id: 3, name: 'Mystic Phoenix', price: 120 },
];

app.get('/api/cards', async (req, res) => {
  try {
    const cachedCards = await redis.get('cards');
    if (cachedCards) {
      return res.json(JSON.parse(cachedCards));
    }

    await redis.set('cards', JSON.stringify(cards), 'EX', 3600);
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const card = cards.find(c => c.id === parseInt(id));

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/cards/buy', async (req, res) => {
  const { cardId, userId } = req.body;

  if (!cardId || !userId) {
    return res.status(400).json({ message: 'Card ID and User ID are required' });
  }

  const card = cards.find(c => c.id === cardId);
  if (!card) {
    return res.status(404).json({ message: 'Card not found' });
  }

  return res.json({ message: `User ${userId} bought card ${card.name}` });
});

app.listen(port, () => {
  console.log(`Card Shop API running on http://localhost:${port}`);
});
