import redis from "redis";


const db =  redis.createClient(
    {
        url:"redis://localhost:6379"
    }
).on("error",(error)=>{console.log(error)}).on("ready",()=>{console.log("Database is ready")});




export default db;