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
    const equipmentCollection = client
      .db("equipmentDB")
      .collection("equipment");
    const userCollection = client.db("equipmentDB").collection("users");
    const cartCollection = client.db("equipmentDB").collection("cart");

    app.post("/equipment", async (req, res) => {
      const newEquipment = req.body;

      const result = await equipmentCollection.insertOne(newEquipment);
      res.send(result);
    });

    app.get("/homeEquipment", async (req, res) => {
      try {
        const cursor = equipmentCollection.find().sort({ _id: -1 }).limit(6);

        const result = await cursor.toArray();

        res.send(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Failed to fetch" });
      }
    });
    app.get("/equipment", async (req, res) => {
      const sortDirection = parseInt(req.query.sort) || 1;
      try {
        const cursor = equipmentCollection.find();

        let result = await cursor.toArray();
        result = result.sort((a, b) => {
          return Number(a.price) - Number(b.price);
        });

        res.send(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Failed to fetch" });
      }
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
    app.get("/myEquipment", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { userEmail: email };
      }
      const cursor = equipmentCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    app.post("/cart", async (req, res) => {
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    });
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/users", async (req, res) => {
      const email = req.body.email;
      const filter = { email };
      const updatedDoc = {
        $set: {
          lastSignInTime: req.body?.lastSignInTime,
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.put("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
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
        },
      };
      const result = await equipmentCollection.updateOne(
        filter,
        updatePerson,
        option
      );
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Equipment getting");
});
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
