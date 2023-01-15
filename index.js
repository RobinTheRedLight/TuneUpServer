const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const productsCollection = client.db('TuneUp').collection('products');
        const adDataCollection = client.db('TuneUp').collection('adData');

        app.get('/categories', async (req, res) => {
            const query = {};
            const options = await categoriesCollection.find(query).toArray();
            res.send(options);
        })

        app.get('/categories/:name', async (req, res) => {
            const name = req.params.name;
            const query = { category: name };
            const options = await productsCollection.find(query).toArray();
            res.send(options);
        })

        app.post('/users', async (req, res) => {
            const allUsers = req.body;
            const email = allUsers.userEmail;
            const query = { userEmail: email };
            const user = await userCollection.findOne(query);
            if (!user) {
                const result = await userCollection.insertOne(allUsers);
                res.send(result);
            }
        });
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products);
            res.send(result);
        });
        app.post('/adData', async (req, res) => {
            const adData = req.body;
            const ID = adData.adID
            const query = { adID: ID };
            const product = await adDataCollection.findOne(query);
            if (!product) {
                const result = await adDataCollection.insertOne(adData);
                res.send(result)
            }
        });
        app.get('/adData', async (req, res) => {
            const query = {};
            const options = await adDataCollection.find(query).toArray();
            res.send(options);
        })
        app.put('/adData/:id', async (req, res) => {

            const id = req.params.id;
            const ObjectId = require('mongodb').ObjectId
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };

            const updatedDoc = {
                $set: {
                    status: 'advertised'
                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });
        app.put('/booking/:id', async (req, res) => {

            const id = req.params.id;
            const ObjectId = require('mongodb').ObjectId
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };

            const updatedDoc = {
                $set: {
                    booking: 'yes'
                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        app.get('/products', async (req, res) => {
            const query = {};
            const options = await productsCollection.find(query).toArray();
            res.send(options);
        })
        app.get('/products/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const options = await productsCollection.find(query).toArray();
            res.send(options);
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const options = await userCollection.find(query).toArray();
            res.send(options);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.userType === 'Admin' });
        });

        app.get('/users/all', async (req, res) => {
            const query = {};
            const options = await userCollection.find(query).toArray();
            res.send(options);
        })

        app.get('/users/all/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.userType === 'Seller' });
        });
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query1 = { _id: ObjectId(id) };
            const query2 = { adID: id };
            const result1 = await productsCollection.deleteOne(query1);
            const result2 = await adDataCollection.deleteOne(query2);
            res.send(result1);
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