const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://maxencevanlaere:IuPqvr1ytD4F7arD@cluster0.ddp5wsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB_NAME = 'Lego';

let client;
let db;

async function connectDB() {
    try {
        if (!client) {
            client = new MongoClient(MONGODB_URI);
            await client.connect(); // Connexion explicite
            db = client.db(MONGODB_DB_NAME);
            console.log('✅ Connected to MongoDB');
        }
        return db;
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

module.exports = { connectDB };