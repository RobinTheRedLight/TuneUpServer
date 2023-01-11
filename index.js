const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fghxosh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('TuneUp').collection('categories');
        const userCollection = client.db('TuneUp').collection('users');

        app.get('/categories', async (req, res) => {
            const query = {};
            const options = await categoriesCollection.find(query).toArray();
            res.send(options);
        })

        app.post('/users', async (req, res) => {
            const allUsers = req.body;
            const result = await userCollection.insertOne(allUsers);
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const query = {};
            const options = await userCollection.find(query).toArray();
            res.send(options);
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });
    }
    finally {

    }
}
run().catch(console.log())

app.get('/', async (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => console.log(`Server is running on ${port}`))