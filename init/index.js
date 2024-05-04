const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modeles/listings.js");

let MONGO_URL = 'mongodb://127.0.0.1:27017/Wanderlust';


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({
...obj, owner: '660576dcc26d8c2b7d4dcf7d'
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
