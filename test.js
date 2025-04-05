const { connectDB } = require('./database.js');

async function testConnection() {
    const db = await connectDB();
    if (db) {
        console.log('✅ Test réussi : Connexion à MongoDB établie.');
    } else {
        console.log('❌ Test échoué : Impossible de se connecter à MongoDB.');
    }
}

testConnection();