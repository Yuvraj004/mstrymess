'use client';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/messages.json'

export default function Home() {
  return (
    <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold"> Dive into the World of Ghost Conversations</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore Mystery Message  - Where your identity remains a secret.</p>
      </section>
      <Carousel plugins={[Autoplay({delay: 2000})]} className="w-full max-w-xs">
        <CarouselContent>
          {messages.map((mess,index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>{mess.title}</CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{mess.content}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
