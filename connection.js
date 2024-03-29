const mongoose = require("mongoose")

const connectMongo = async ()=>{
   return mongoose.connect(process.env.mongoUrl).then(() => {
        console.log("Connected To Mongo");
      }).catch((error) => {
        console.log("Cannot Connect : ", error);
      })
    }

    module.exports = connectMongo;