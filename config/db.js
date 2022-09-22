const mongoose = require("mongoose");
module.exports = function () {
    mongoose
        .connect("mongodb://localhost/devconnecters")
        .then(() => console.log("Connected to MongoDB..."))
        .catch(() => console.error("Could not connect to MongoDB..."));

}