import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { ProjectsSection } from '@/components/projects-section';
import { ExperienceSection } from '@/components/experience-section';
import { BlogSection } from '@/components/blog-section';
import { ContactSection } from '@/components/contact-section';
import { getAllPostSummaries } from '@/lib/posts';

export default function HomePtBr() {
  const posts = getAllPostSummaries('pt-BR');

  return (
    <main className="relative z-10 min-h-screen bg-transparent text-white">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <BlogSection posts={posts} />
      <ContactSection />
    </main>
  );
}
