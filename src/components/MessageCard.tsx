import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/userModel"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const { toast } = useToast();

    async function handleDeleteConfirm() {
        const result = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast({
            title: result.data.message
        })
        console.log('what type of msg: ', typeof (message._id));
        let msgId: string = ''; // Initialize with a default value

        if (typeof message._id === 'string') {
            msgId = message._id;
        } else {
            console.error('message._id is not a string:', message._id);
            toast({
                title: "Error: Invalid message ID."
            })
            return; //stop the delete function.
        }
        // const msgId: string = '';
        onMessageDelete(msgId)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{message.content}</p>
            </CardContent>
            <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X className="w-5 h-5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>

    )
}

export default MessageCard