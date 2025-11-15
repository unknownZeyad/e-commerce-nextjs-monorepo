import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@packages/client/src/components/ui/carousel'

function Hero() {
  return (
    <section className='h-screen overflow-hidden relative'>
      <Carousel 
        className="w-screen absolute top-0 left-0 h-screen"
        opts={{
          loop: true
        }} 
      >
        <CarouselContent className="h-full">
          <CarouselItem className="w-screen h-screen flex-[0_0_100%]">
            <img
              src="/image/hero2.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </CarouselItem>
          <CarouselItem className="w-screen h-screen flex-[0_0_100%]">
            <img
              src="/image/hero1.webp"
              alt=""
              className="w-full h-full object-cover"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="container h-full">

      </div>
    </section>
  )
}

export default Hero