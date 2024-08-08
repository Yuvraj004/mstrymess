import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/userModel";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from 'mongoose';
import { Message } from "@/model/userModel";

export async function POST(request:Request) {
    await dbConnect();

    const {username,content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                'success':false,
                'message':"User not found"
            },{status:404})
        }

        //is user accepting messages
        if(!user.isAcceptingMessage){
            return Response.json({
                'success':false,
                'message':"User not accepting messages"
            },{status:403})
        }

        const newMess = {content,createdAt:new Date()}


       user.messages.push(newMess as Message)//asserted that the newMess has the interface Message
       await user.save();

       return Response.json({
            'success':true,
            'message':"message sent successfully"
        },{status:201})
    } catch (error) {
        console.log('error sending msgs',error)
        return Response.json({
            'success':false,
            'message':"Not able to send msg"
        },{status:500})
    }
}