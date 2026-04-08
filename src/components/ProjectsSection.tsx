import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Google Knowledge Panel Review",
    desc: "An in-depth review of the Google Knowledge Panel setup and features.",
  },
  {
    title: "Biostar TV World Project",
    desc: "Live TV streaming platform development and integration.",
  },
  {
    title: "Wiki Page Globalpedia",
    desc: "Wiki Pages (Globalpedia) Web Project development and implementation.",
  },
  {
    title: "Chess Game Report Review",
    desc: "A detailed review of the Chess Game project, covering design, features, and educational value.",
  },
  {
    title: "ICT Foundation",
    desc: "Empowering the digital future of Bangladesh through ICT training, innovation, and opportunities.",
  },
];

const ProjectsSection = () => (
  <section id="projects" className="py-24">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-16">
        Featured <span className="text-gradient-gold">Projects</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.title}
            className="group bg-gradient-card rounded-xl p-6 shadow-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
          >
            <h3 className="font-serif font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
              {p.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
              View Project <ExternalLink size={12} />
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
