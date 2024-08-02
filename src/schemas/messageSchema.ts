import {z} from 'zod';


export const messageSchema = z.object({
    content:z.string().min(10,{message:'Atleast 10 characters of content'}).max(300,{message:'Cannot store more than this'})

})