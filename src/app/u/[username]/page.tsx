'use client';
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const page = () => {
  //extracting username from params
  const param = useParams<{ username: string }>();
  const { toast } = useToast();
  
  //creating form resolver
  const form = useForm<z.infer<typeof messageSchema>>({
    //using zod resolver and signupschema
    resolver: zodResolver(messageSchema),
  });
  
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post('/api/send-message', {
        username: param.username,
        content: data.content
      })
      
      toast({
          title: 'Success',
          description: response.data.message
      })
        
    } catch (error) {
      console.error("Eror in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
          title: "Could not send Message",
          description: errorMessage,
          variant: "destructive",
      });
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Write you msytery Message 
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                        <Input type='text' placeholder="Message" {...field}
                        /> 
                    </FormControl>
                    <FormDescription>
                        Write your Message
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                  />
                  <Button type="submit"> Send </Button>
            </form>
          </Form>
      </div>
  </div>
  )
}

export default page