const {
    MongoClient,
    ServerApiVersion
} = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is not defined in the .env file.");
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

async function connectDatabase() {
    try {
        await client.connect();

        const db = client.db("before_we_become_us");

        await db.command({
            ping: 1
        });

        console.log("MongoDB connected successfully.");

        return db;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}

module.exports = {
    client,
    connectDatabase
};