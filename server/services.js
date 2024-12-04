//Bring in Mongo and Harry Potter


//Define Database URL


//Define the database server


var services = function(app) {

    app.post('/add-spell', async function(req, res) {

    });

    app.get('/get-spells', async function(req, res) {

    });

    app.get("/get-spellsByType", async function(req, res) {
 
    });

    app.put('/update-spell', async function(req, res) {


    });

    app.delete('/delete-spell', async function(req, res) {
        
    });

    //For refreshing the spells table
    app.post('/refreshSpells', async function(req, res) {
    // console.log("In refresh spells");
    try {
        const conn = await client.connect();
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
        const conn = await client.connect();
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

