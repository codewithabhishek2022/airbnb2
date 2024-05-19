const mongoose =require("mongoose");
const initData =require("./data.js");
const Listing =require("../models/listing.js");

const MONGO_URL ="mongodb+srv://wander:wander@cluster0.5gukalx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function main (){
await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

const initDB = async ()=>{
    await Listing.deleteMany({});
     initData.data=initData.data.map((obj)=>({...obj,owner:"6649ea2ad269fa287c1dda68"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised successfully");
};
initDB();
