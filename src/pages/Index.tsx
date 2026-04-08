import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import MusicSection from "@/components/MusicSection";
import BooksSection from "@/components/BooksSection";
import PublicationsSection from "@/components/PublicationsSection";
import BlogSection from "@/components/BlogSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <MusicSection />
      <BooksSection />
      <PublicationsSection />
      <BlogSection />
      <FooterSection />
    </div>
  );
};

export default Index;
