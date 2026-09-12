// Load .env
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../MODELS/listing.js");
const { data } = require("../initialize/data.js");

const dbUrl = process.env.ATLASDB_URL;


// Function to get coordinates from location + country
async function getCoordinates(location, country) {

    const query = `${location}, ${country}`;

    const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "WanderLust-App"
        }
    });

    if (!response.ok) {
        throw new Error(
            `Nominatim request failed: ${response.status}`
        );
    }

    const result = await response.json();

    if (result.length === 0) {
        console.log(`Location not found: ${query}`);
        return null;
    }

    const latitude = parseFloat(result[0].lat);
    const longitude = parseFloat(result[0].lon);

    // GeoJSON uses [longitude, latitude]
    return [longitude, latitude];
}


// Seed database
async function seedDB() {

    try {

        // Connect to MongoDB Atlas
        await mongoose.connect(dbUrl);

        console.log("Connected to MongoDB Atlas");


        // Delete existing listings
        await Listing.deleteMany({});

        const listingsWithGeometry = [];


        // Process every listing
        for (let listing of data) {

            console.log(
                `Searching location: ${listing.location}, ${listing.country}`
            );

            const coordinates = await getCoordinates(
                listing.location,
                listing.country
            );


            // Skip listing if location was not found
            if (!coordinates) {
                console.log(`Skipping: ${listing.title}`);
                continue;
            }


            // Add geometry
            listingsWithGeometry.push({
                ...listing,

                geometry: {
                    type: "Point",
                    coordinates: coordinates
                }
            });


            // Wait 1 second between requests
            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );
        }


        // Insert all listings
        await Listing.insertMany(listingsWithGeometry);

        console.log(
            `${listingsWithGeometry.length} listings inserted successfully!`
        );

    } catch (err) {

        console.log("ERROR:", err);

    } finally {

        await mongoose.connection.close();

        console.log("MongoDB connection closed");
    }
}


// IMPORTANT: Run the function
seedDB();