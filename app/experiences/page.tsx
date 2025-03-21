import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FaBriefcase } from "react-icons/fa"
import { experiences } from '../data/experiences'

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12">Work Experience</h1>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
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
    </div>
  )
}