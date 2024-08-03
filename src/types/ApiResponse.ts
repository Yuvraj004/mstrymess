import { Message } from "@/model/userModel";
export interface ApiResponse{
    success: boolean;
    message: string;
    status?: number;
    isAcceptingMessages?:boolean;
    messages?: Array<Message>
}