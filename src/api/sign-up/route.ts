import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/userModel";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST (request:Request) {
    await dbConnect()
    try {
        const {username,email,password}=await request.json();
        const existingUserVerifyByUsername= await UserModel.findOne({
            username,
            isVerified: true
        })

        if(!existingUserVerifyByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        //generating verifycode
        const verifyCode= Math.floor(100000 +Math.random()*900000).toString()
        if(email){
            true //
        }else{
            const hashedPass= await bcrypt.hash(password,10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1);

            new UserModel({
                username,
                email ,
                password:hashedPass,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage: true,
                messages:[]
            })
        }
    } catch (error) {
        console.error('Error registering user',error)
        return Response.json({
            success: false,
            message: "Error registering User"
        },{status:500})
    }
}