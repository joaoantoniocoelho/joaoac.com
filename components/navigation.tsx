"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export function Navigation() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-black/50 backdrop-blur-md overflow-hidden max-w-[100vw]"
    >
      <div className="flex justify-center w-full">
        <nav className="container mx-auto px-4 md:px-6 py-4 max-w-full md:max-w-6xl">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="text-xl md:text-2xl font-bold truncate max-w-[40%]">João Coelho</Link>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/#about" className="hover:text-gray-300 transition">About</Link>
              <Link href="/#experience" className="hover:text-gray-300 transition">Experience</Link>
              <Link href="/#blog" className="hover:text-gray-300 transition">Blog</Link>
              <Link href="/#contact" className="hover:text-gray-300 transition">Contact</Link>
            </div>

            <div className="flex space-x-3 md:space-x-4">
              <a href="https://github.com/joaoantoniocoelho" target="_blank" rel="noopener noreferrer">
                <FaGithub className="w-5 h-5 md:w-6 md:h-6 hover:text-gray-300 transition" />
              </a>
              <a href="https://www.linkedin.com/in/joaoac" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="w-5 h-5 md:w-6 md:h-6 hover:text-gray-300 transition" />
              </a>
              <a href="https://x.com/joaoac_dev" target="_blank" rel="noopener noreferrer">
                <FaXTwitter className="w-5 h-5 md:w-6 md:h-6 hover:text-gray-300 transition" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}