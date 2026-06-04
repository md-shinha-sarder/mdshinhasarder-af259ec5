import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import VideosSection from "@/components/VideosSection";
import ReelsSection from "@/components/ReelsSection";
import MusicSection from "@/components/MusicSection";
import BooksSection from "@/components/BooksSection";
import PublicationsSection from "@/components/PublicationsSection";
import BlogSection from "@/components/BlogSection";
import FooterSection from "@/components/FooterSection";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useHomeSections } from "@/hooks/useHomeSections";

const Index = () => {
  useSiteSettings();
  const { sections } = useHomeSections();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {sections.hero && <HeroSection />}
      {sections.about && <AboutSection />}
      {sections.skills && <SkillsSection />}
      {sections.projects && <ProjectsSection />}
      {sections.services && <ServicesSection />}
      {sections.gallery && <GallerySection />}
      {sections.videos && <VideosSection />}
      {sections.reels && <ReelsSection />}
      {sections.music && <MusicSection />}
      {sections.books && <BooksSection />}
      {sections.publications && <PublicationsSection />}
      {sections.blog && <BlogSection />}
      <FooterSection />
    </div>
  );
};

export default Index;
