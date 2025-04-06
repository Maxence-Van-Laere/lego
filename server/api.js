const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000', // Origine pour le développement local
      'https://v2-lego-webdesign-mvl.vercel.app/' // Origine pour la production
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Autoriser l'origine
    } else {
      callback(new Error('Not allowed by CORS')); // Bloquer l'origine
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));
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

app.get('/deals/search', async (request, response) => {
  const { limit = 12, price, date, filterBy } = request.query; 

  try {
    const deals = db.collection('deals');
    const query = {};
    const options = {
      limit: parseInt(limit, 10), 
    };

    // Apply filters
    if (price) {
      query.price = { $lte: parseFloat(price) }; // Ensure price is compared as a number
    }
    if (date) {
      query.published = { $lte: new Date(date).getTime() / 1000 }; // Convert date to UNIX timestamp
    }

    // Apply sorting only if filterBy is provided
    if (filterBy === 'best-discount') {
      options.sort = { discount: -1 }; // Sort by discount in descending order
    } else if (filterBy === 'most-commented') {
      options.sort = { comments: -1 }; // Sort by comments in descending order
    }

    const results = await deals.find(query, options).toArray();
    const total = results.length;

    response.json({
      limit: parseInt(limit, 10),
      total,
      results,
    });
  } catch (error) {
    console.error('Error searching deals:', error);
    response.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/deals/:id?', async (request, response) => {
  const dealId = request.params.id;

  try {
    const deals = db.collection('deals');

    if (dealId) {
      // Validate if dealId is a valid ObjectId
      if (!ObjectId.isValid(dealId)) {
        return response.status(400).send({ error: 'Invalid ID format' });
      }

      // Convert dealId to ObjectId and query using `_id`
      const deal = await deals.findOne({ _id: new ObjectId(dealId) });

      if (deal) {
        return response.json(deal);
      } else {
        return response.status(404).send({ error: 'Deal not found' });
      }
    } else {
      // If no id is provided, return all deals
      const allDeals = await deals.find().toArray();
      return response.json(allDeals);
    }
  } catch (error) {
    console.error('Error fetching deal(s):', error);
    response.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/sales/search', async (request, response) => {
  const { limit = 12, legoSetId, price } = request.query;

  try {
    const sales = db.collection('sales');
    const query = {};

    // Apply filters
    if (legoSetId) {
      query.legoSetId = legoSetId;
    }
    if (price) {
      query.price = { $lte: parseFloat(price) }; // Ensure price is compared as a float
    }

    const results = await sales
      .aggregate([
        {
          $addFields: {
            price: { $toDouble: "$price" }, // Convert price to float for comparison
          },
        },
        { $match: query },
        { $sort: { price: 1 } },
        { $limit: parseInt(limit, 10) }, // Limit the number of results
      ])
      .toArray();

    const total = results.length;

    response.json({
      limit: parseInt(limit, 10),
      total,
      results,
    });
  } catch (error) {
    console.error('Error searching sales:', error);
    response.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
