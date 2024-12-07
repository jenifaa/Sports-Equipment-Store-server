require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5lka3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const equipmentCollection = client
      .db("equipmentDB")
      .collection("equipment");
    const userCollection = client.db("equipmentDB").collection("users");
    // const sortCollection = client.db.("equipmentDB").find().sort( { "price": 1 } )


    // db.equipmentCollection.find(query).limit(6);

    app.post("/equipment", async (req, res) => {
      const newEquipment = req.body;
      // console.log(newEquipment);
      const result = await equipmentCollection.insertOne(newEquipment);
      res.send(result);
    });

    app.get("/equipment", async (req, res) => {
     

      const cursor = equipmentCollection.find().sort( { "price": 1 } )
      ;
      // const sortDirection = req.query.sort ===  1 ;
      // const cursor = equipmentCollection.find().sort({ price: sortDirection });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.findOne(query);
      res.send(result);
    });

    //USER DATA:

     app.post('/users', async(req,res) =>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser)
      res.send(result);
     })
     app.get('/users', async(req,res) =>{
      const cursor = userCollection.find();
      const result = await cursor.toArray()
      res.send(result);
     })

     app.delete('/users/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
     })

    app.patch('/users', async(req,res) =>{
      const email = req.body.email;
      const filter = {email};
      const updatedDoc = {
        $set: {
          lastSignInTime: req.body?.lastSignInTime
        }
      }
      const result = await userCollection.updateOne(filter,updatedDoc)
      res.send(result)
    })

    app.put('/equipment/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedUser = req.body;
    const filter = {_id: new ObjectId(id)}
    const option = {upsert: true}
    const updatePerson = {
      $set: {
        rating: updatedUser.rating,
        price: updatedUser.price,
        customization: updatedUser.customization,
        time: updatedUser.time,
        quantity: updatedUser.quantity,
        category: updatedUser.category,
        details: updatedUser.details,
        photo: updatedUser.photo,
      }
    }
    const result = await equipmentCollection.updateOne(filter,updatePerson, option)
    res.send(result);

    })




         //END UserData

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Equipment getting");
});
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
