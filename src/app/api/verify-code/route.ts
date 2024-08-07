import UserModel from "@/model/userModel";
import dbConnect from "@/lib/connectDB";


export async function POST(request:Request) {
    await dbConnect();

    try {
        const {username,code} = await  request.json();
        console.log({code})
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:400})
        }

        const isCodeValid = (user.verifyCode === code) ;
        const hasCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
        
        if(isCodeValid){
            user.isVerified = true
            await user.save();
            return Response.json({
                success:true,
                message:"User Verfied"
            },{status:201})
        }

        else if(hasCodeExpired){
            return Response.json({
                success:false,
                message:"Verification code Expired!!!"
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"Code is wrong"
            },{status:400})
        }

    } catch (error) {
        console.error("Could not verify code ,check the expiry",error)
        return Response.json({
            success:false,
            message:"Verification of code unsuccessfull , please check your code's Expiry ; Or signUp again"
        },{status:500})
    }
}