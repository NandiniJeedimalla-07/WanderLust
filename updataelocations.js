const mongoose = require("mongoose");
const Listing = require("./MODELS/listing.js");

async function updateLocations() {

    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

    console.log("Connected to MongoDB");

    const listings = await Listing.find({
        geometry: { $exists: false }
    });

    console.log("Listings without coordinates:", listings.length);

    for (let listing of listings) {

        const location =
            `${listing.location}, ${listing.country}`;

        console.log("Searching:", location);

        try {

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
                {
                    headers: {
                        "User-Agent": "WanderLust/1.0"
                    }
                }
            );

            const geoData = await response.json();

            if (geoData.length > 0) {

                listing.geometry = {
                    type: "Point",
                    coordinates: [
                        parseFloat(geoData[0].lon),
                        parseFloat(geoData[0].lat)
                    ]
                };

                await listing.save();

                console.log(
                    `Updated: ${listing.title}`
                );

            } else {

                console.log(
                    `Location not found: ${location}`
                );

            }

        } catch (error) {

            console.log(
                `Error for ${listing.title}:`,
                error.message
            );

        }
    }

    console.log("Finished!");

    await mongoose.connection.close();
}

updateLocations();