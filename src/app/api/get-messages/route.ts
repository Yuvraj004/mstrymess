import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/userModel";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from 'mongoose';


export async function GET(request:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const userData:User = session?.user as User;//assertion required

    if (!session || !session.user){
        return Response.json({
            'success':false,
            'message':"Not Authenticated"
        },{status:401})
    }

    const userId = new mongoose.Types.ObjectId(userData._id);

    try {
        //aggregation pipeline to optimize collecting the message array from
        // db
        // if there are two messge in one user then this pipline divides the 
        // user into two subid with one msg each as an object in itself
        const user = await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id:'$_id', messages:{$push: '$messages'}}}
        ])

        if(!user || user.length === 0){
            return Response.json({
                'success':false,
                'message':"User not found"
            },{status:401})
        }
        return Response.json({
            'success':true,
            'message':"Returning Messages",
            messages: user[0].messages
        },{status:201})
    } catch (error) {
        console.log('Were not able to get msg',error)
        return Response.json({
            'success':false,
            'message':"Error while getting msgs"
        },{status:401})
    }
}