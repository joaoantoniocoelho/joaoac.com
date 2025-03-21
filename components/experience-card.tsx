"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FaBriefcase } from "react-icons/fa"
import { FaChevronDown } from "react-icons/fa"

interface ExperienceCardProps {
  title: string
  company: string
  companyUrl: string
  period: string
  description: string
  skills: string[]
}

export function ExperienceCard({ title, company, companyUrl, period, description, skills }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="p-4 sm:p-6 bg-black/30 backdrop-blur w-full">
      <div className="flex items-start gap-3 sm:gap-4">
        <FaBriefcase className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" aria-hidden="true" />
        <div className="w-full overflow-hidden">
          <h3 className="text-xl sm:text-2xl font-bold break-words">{title}</h3>
          <p className="text-gray-300">
            <a 
              href={companyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white underline"
              aria-label={`Visit ${company} website`}
            >
              {company}
            </a>
            {' • '}
            {period}
          </p>
          
          {!isExpanded ? (
            <div className="relative mt-2">
              <p className="text-gray-200 text-sm md:text-base line-clamp-3 text-justify">
                {description}
              </p>
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-200 text-sm md:text-base text-justify">
                {description}
              </p>
            </div>
          )}
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 mt-2 text-xs text-gray-300 hover:text-white"
            aria-label={isExpanded ? 'Show less content' : 'Read more content'}
          >
            <span>{isExpanded ? 'Show less' : 'Read more'}</span>
            <FaChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <Badge key={i} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 