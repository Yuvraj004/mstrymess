'use client';

import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/userModel";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isswitchloading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  
  //ui update pehle baad mein backend update
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((mess) => mess._id !== messageId))//jo match nhi kr rhe unhe filter krdo
  }
  
  const { data: session } = useSession()
  
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  
  const { register, watch, setValue } = form;
  
  const acceptMessages = watch('acceptMessages');
  
  const fetchAcceptMess = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages',res.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
     
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant:"destructive"
      
      })
      setIsLoading(false)
    } finally {
      setIsSwitchLoading(false)
    }
  },[setValue ])
  const fetchMessages = useCallback(async (refresh:boolean) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      
      setMessages(response.data.messages || [])
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description:"showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: "Error fetching messages",
        variant:"destructive"
      })
    } finally {
      setIsSwitchLoading(false);
    }
  },[])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard