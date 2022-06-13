const { MongoClient } = require('mongodb');

async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    const uri = `mongodb://localhost:27017/node_fg`;

    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls


       /* await createMember(client,
            {
                first_name: "Naira",
                last_name: "Petrosyan",
                is_contributing: true,
                created_at: new Date()
            }
        );*/
        /*await findOne(client,
            {
                first_name: 'Naira'
            }
        );*/

       /* await updateOne(client,
            {
                first_name: 'Naira'
            },
            {
                topics: ['MongoDB'],
                number_of_topics: 10
            },
        );*/
        await updateOne(client,
            {
                first_name: 'Levon'
            },
            {
                is_contributing: [1, 2]
            },
        );

        /*await updateOne(client,
            {
                first_name: 'Levon'
            },
            {
                is_contributing: false,
                number_of_topics: 20
            },
            {upsert: true}
        );*/
        /* await createMember(client,
                    {
                        first_name: "Armen",
                        last_name: "Feroyan",
                        is_contributing: false,
                        number_of_topics: 2
                    }
                );*/

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);


async function findOne(client, query) {
    const result = await client.db("node_fg").collection("members").findOne(query);
    if (result) {
        console.log(`Found a member in the collection with the query '${JSON.stringify(query)}':`);
        console.log(result);
    } else {
        console.log(`No member found with the query '${JSON.stringify(query)}'`);
    }
}

async function createMember(client, newMember){
    const result = await client.db("node_fg").collection("members").insertOne(newMember);
    console.log(`New member created with the following id: ${result.insertedId}`);
}

async function updateOne(client, query, updateObj, options = {}) {
    const result = await client.db("node_fg").collection("members")
        .updateOne(query, { $set: updateObj }, options);
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}