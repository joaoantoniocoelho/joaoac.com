import { HeroScene } from '@/components/hero-scene'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaExternalLinkAlt } from "react-icons/fa"
import { FaLinkedin } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa6"
import { MdEmail } from "react-icons/md"
import { ExperienceCard } from '@/components/experience-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from 'next/link'
import { getMediumPosts } from './utils/medium'
import { ReactElement, JSXElementConstructor, ReactNode, PromiseLikeOfReactNode, ReactPortal, Key } from 'react'
import { experiences } from './data/experiences'

export default async function Home() {
  const blogPosts = await getMediumPosts()
  
  return (
    <>
      <HeroScene />
      
      <section id="about" className="py-20 bg-black w-full overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-full md:max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">About Me</h2>
          <p className="text-base md:text-xl text-gray-300 max-w-6xl mb-4 text-justify">
            I’m João, a software engineer passionate about backend and full-stack development. I’ve helped build secure payment systems, compliance solutions, and AI-powered enterprise apps — always aiming for clean code, scalable architecture, and real-world impact. I enjoy working across the stack, especially when cloud platforms and distributed systems are involved.
          </p>
          <p className="text-base md:text-xl text-gray-300 max-w-6xl text-justify">
            Outside of work, I’m usually exploring new coffee shops, battling bosses in <em>World of Warcraft</em>, or playing <em>League of Legends</em>. I share my days with Ichiro, a clever and independent Shiba Inu, and Tobby, a sweet and sleepy Shih Tzu. I also train Muay Thai — it helps me stay focused, disciplined, and balanced (especially after a tough ranked match).
          </p>
        </div>
      </section>



      <section id="experience" className="py-20 bg-black/50 w-full overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-full md:max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
            <Button variant="outline" asChild>
              <Link href="/experiences" className="flex items-center gap-2 text-sm md:text-base">
                View all experiences <FaArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-8 w-full">
            {experiences.slice(0, 2).map((exp, index) => (
              <ExperienceCard 
                key={index}
                title={exp.title}
                company={exp.company}
                companyUrl={exp.companyUrl || ''}
                period={exp.period}
                description={exp.description}
                skills={exp.skills}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="py-20 bg-black w-full overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-full md:max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Latest Posts</h2>
            <Button variant="outline" asChild>
              <a 
                href="https://medium.com/@joaoac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                View all posts <FaExternalLinkAlt className="w-4 h-4" />
              </a>
            </Button>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-full overflow-hidden"
          >
            <CarouselContent className="-ml-4 max-w-full">
              {blogPosts.map((post: { thumbnail: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; pubDate: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; content: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; link: string | undefined }, index: Key | null | undefined) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 max-w-full">
                  <Card className="overflow-hidden bg-black/30 backdrop-blur h-full max-w-full">
                    <img 
                      src={post.thumbnail?.toString()}
                      alt={post.title?.toString() || ''}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-3">
                        <span>{post.pubDate}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      <Button variant="secondary" asChild className="w-full">
                        <a 
                          href={post.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-4 text-sm md:text-base"
                        >
                          Read More <FaArrowRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      <section id="contact" className="py-20 bg-black w-full overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-full md:max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Contact</h2>
          <div className="grid md:grid-cols-2 gap-8 w-full">
            <Card className="p-4 sm:p-6 bg-black/30 backdrop-blur max-w-full">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <MdEmail className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <div className="overflow-hidden">
                  <h3 className="font-bold text-base md:text-lg">Email</h3>
                  <a 
                    href="mailto:joaoantonioscoelho@gmail.com" 
                    className="text-gray-300 hover:text-white flex flex-col text-sm md:text-base"
                  >
                    <span>Drop me a message</span>
                    <span className="text-xs md:text-sm opacity-75">joaoantonioscoelho@gmail.com</span>
                  </a>
                </div>
              </div>
            </Card>
            <Card className="p-4 sm:p-6 bg-black/30 backdrop-blur max-w-full">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <div className="overflow-hidden">
                  <h3 className="font-bold text-base md:text-lg">LinkedIn</h3>
                  <a 
                    href="https://www.linkedin.com/in/joaoac" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors text-sm md:text-base"
                  >
                    Let's connect on LinkedIn
                    <FaArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}