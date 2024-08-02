import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number //optional value ho bhi skti h nhi bhi

}

const conn : ConnectionObject = {}

async function dbConnect():Promise<void> {
    if (conn.isConnected){
        console.log('Already connected to Database');
        return
    }

    try {
        const db = await mongoose.connect(process.env.CONNECTION_DB_URI || '')
        console.log(db)

        conn.isConnected = db.connections[0].readyState

        console.log('DB connected Successfully');
    } catch (error) {

        console.log('DB connection failed',error);
        process.exit(1)
    }
}

export default dbConnect;