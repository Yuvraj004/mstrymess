import UserModel from "@/model/userModel";
import dbConnect from "@/lib/connectDB";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth"; //to get data about the current user
import { User } from "next-auth";

//why:

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const userData: User = session?.user as User; //assertion required

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }

  const userId = userData._id;

  const { acceptMessages } = await req.json();

  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true },
    );

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Updated user for accepting messages",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const userData: User = session?.user as User; //assertion required

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }

  const userId = userData._id;

  try {
    const foundUSer = await UserModel.findById(userId);

    if (!foundUSer) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUSer.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in getting message acceptance status");
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 },
    );
  }
}
