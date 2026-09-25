const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj, index) => ({
        ...obj,
        owner: "6a6f07236f891b0d061c54d0",
        category: categories[index % categories.length]
    }));

    initData.data.forEach((obj, index) => {
        if (!obj.geometry || !obj.geometry.type) {
            console.log(
                "Missing geometry:",
                index,
                obj.title,
                obj.location
            );
        }
    });

    await Listing.insertMany(initData.data);

    console.log("Data was initialized");
};