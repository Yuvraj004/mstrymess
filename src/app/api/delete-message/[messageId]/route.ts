import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/userModel";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";


export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    
    const messageid = params.messageId;
    await dbConnect();

    const session = await getServerSession(authOptions);

    const userData: User = session?.user as User;//assertion required

    if (!session || !session.user) {
        return Response.json({
            'success': false,
            'message': "Not Authenticated"
        }, { status: 401 })
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: userData._id },
            {$pull:{messages:{_id:messageid}}}
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json({
                'success': false,
                'message': "Message could not be upadated or already Deleted."
            }, { status: 404 })
        }
         return Response.json({
            'success': true,
            'message': "Message Deleted"
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({
            'success': false,
            'message': "Could not delete the message"
        }, { status: 500 })
    }
}