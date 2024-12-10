//Bring in Mongo and Harry Potter
const harryPotterSpells = require('harry-potter-spells');
const { MongoClient, ObjectId } = require('mongodb');

//Define Database URL
const dbUrl = process.env.DB_URI || "mongodb://127.0.0.1";

//Define the database server
const dbClient = new MongoClient(dbUrl);

var services = function(app) {
    //POST - server side for adding spells
    app.post('/add-spell', async function(req, res) {
        var newSpell = {
            name: req.body.name,
            type: req.body.type,
            effect: req.body.effect,
            'counter-spell': req.body.counter
        };

        var search = { name: req.body.name };

        try{
            const conn = await dbClient.connect();
            const db = conn.db("harrypotter");
            const coll = db.collection("spells");

            const spell = await coll.find(search).toArray();

            //if array length greater than 0, spell exists, dont add
            if(spell.length > 0) {
                await client.close();
                return res.send(JSON.stringify({ msg: "Spell Already Exists" }));
            } else {
                await coll.insertOne(newSpell);
                await conn.close();
                return res.send(JSON.stringify({ msg: "SUCCESS" }));
            }
        } catch (error) {
            await conn.close();
            return res.send(JSON.stringify({ msg: "Error" + error }));
        }
    });

    //GET - server side retrieve spells
    app.get('/get-spells', async function(req, res) {
        try {
            const conn = await dbClient.connect();
            const db = conn.db("harrypotter");
            const coll = db.collection("spells");

            const data = await coll.find().toArray();

            await conn.close();

            return res.send(JSON.stringify({ msg: "SUCCESS", spells: data }));
        } catch (error) {
            await conn.close();
            return res.send(JSON.stringify({ msg: "Error" + error }));
        }
    });

    //GET (by type) - server side for getting spells by type
    app.get("/get-spellsByType", async function(req, res) {
        var search = (req.query.type === "") ? {} : { type: req.query.type };

        try {
            const conn = await dbClient.connect();
            const db = conn.db("harrypotter");
            const coll = db.collection("spells");

            const data = await coll.find(search).toArray();

            await conn.close();

            return res.send(JSON.stringify({ msg: "SUCCESS", spells: data }));
        } catch (error) {
            await conn.close();
            return res.send(JSON.stringify({ msg: "Error" + error }));
        }
    });

    //PUT - server side for updating spells
    app.put('/update-spell', async function(req, res) {
        
    });

    //DELETE - server side for deleteing spells
    app.delete('/delete-spell', async function(req, res) {
        
    });

    //For refreshing the spells table
    app.post('/refreshSpells', async function(req, res) {
    // console.log("In refresh spells");
        try {
            const conn = await dbClient.connect();
            const db = conn.db("harrypotter");
            const coll = db.collection('spells');
            await coll.drop();
            console.log("Dropped database");
            await client.close();
            initializeDatabase();
            return res.status(200).send(JSON.stringify({msg:"SUCCESS"}));        
        } catch(err) {
            console.log(err);
            return res.status(200).send(JSON.stringify({msg:"Error: " + err}));
        }
    });
}

//To Initialize the spells table
var initializeDatabase = async function() {
    try {
        const conn = await dbClient.connect();
        const db = conn.db("harrypotter");
        const coll = db.collection('spells');
        const data = await coll.find().toArray();

        if(data.length === 0) {
            var spells = harryPotterSpells.all;
            await coll.insertMany(spells);
            console.log("Added seed records");
        }

        await conn.close();
    } catch(err) {
        console.log(err);
    }
}

module.exports = { services, initializeDatabase };