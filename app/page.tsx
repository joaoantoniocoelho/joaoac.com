import { HeroScene } from '@/components/hero-scene'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BriefcaseIcon, 
  MailIcon, 
  PhoneIcon,
  ArrowRightIcon,
  ExternalLinkIcon
} from 'lucide-react'
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
import { FaBriefcase } from "react-icons/fa"
import { FaLinkedin } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa6"

export default async function Home() {
  const blogPosts = await getMediumPosts()
  
  return (
    <>
      <HeroScene />
      
      <section id="about" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">About Me</h2>
          <p className="text-xl text-gray-300 max-w-3xl">
            I'm a passionate Full Stack Developer with over 5 years of experience
            building modern web applications. I specialize in React, Node.js, and
            cloud technologies, with a strong focus on creating scalable and
            maintainable solutions.
          </p>
        </div>
      </section>

      <section id="experience" className="py-20 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Experience</h2>
            <Button variant="outline" asChild>
              <Link href="/experiences" className="flex items-center gap-2">
                View all experiences <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-8">
            {experiences.slice(0, 2).map((exp, index) => (
              <Card key={index} className="p-6 bg-black/30 backdrop-blur">
                <div className="flex items-start gap-4">
                  <FaBriefcase className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold">{exp.title}</h3>
                    <p className="text-gray-300">
                      <a 
                        href={exp.companyUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-white underline"
                      >
                        {exp.company}
                      </a>
                      {' • '}
                      {exp.period}
                    </p>
                    <p className="mt-2">{exp.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Latest Posts</h2>
            <Button variant="outline" asChild>
              <a 
                href="https://medium.com/@joaoac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                View all posts <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </Button>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {blogPosts.map((post: { thumbnail: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; pubDate: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; content: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; link: string | undefined }, index: Key | null | undefined) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden bg-black/30 backdrop-blur h-full">
                    <img 
                      src={post.thumbnail?.toString()}
                      alt={post.title?.toString() || ''}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <span>{post.pubDate}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      <Button variant="secondary" asChild className="w-full">
                        <a 
                          href={post.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-4"
                        >
                          Read More <ArrowRightIcon className="w-4 h-4" />
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

      <section id="contact" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">Contact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-black/30 backdrop-blur">
              <div className="flex items-center gap-4 mb-4">
                <MailIcon className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Email</h3>
                  <a 
                    href="mailto:john@example.com" 
                    className="text-gray-300 hover:text-white flex flex-col"
                  >
                    <span>Drop me a message</span>
                    <span className="text-sm opacity-75">john@example.com</span>
                  </a>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-black/30 backdrop-blur">
              <div className="flex items-center gap-4 mb-4">
                <FaLinkedin className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">LinkedIn</h3>
                  <a 
                    href="https://www.linkedin.com/in/joaoac" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
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