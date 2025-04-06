const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

const MONGODB_URI = 'mongodb+srv://maxencevanlaere:IuPqvr1ytD4F7arD@cluster0.ddp5wsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(MONGODB_URI);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    return client.db('Lego');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}

let db;
connectToDatabase().then(database => {
  db = database;
});

app.get('/', (request, response) => {
  response.send({ 'ack': true });
});

app.get('/deals/:id', async (request, response) => {
  const dealId = request.params.id;

  try {
    const deals = db.collection('deals');

    // Convert dealId to ObjectId and query using `_id`
    const deal = await deals.findOne({ _id: new ObjectId(dealId) });

    if (deal) {
      response.json(deal);
    } else {
      response.status(404).send({ error: 'Deal not found' });
    }
  } catch (error) {
    console.error('Error fetching deal:', error);
    response.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
