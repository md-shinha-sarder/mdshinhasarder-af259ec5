import { Search, Wallet, Bot } from "lucide-react";

const projects = [
  {
    icon: Search,
    cat: "Software",
    title: "Algorithm Visualization Tool",
    desc: "An interactive tool that visualizes sorting and searching algorithms step-by-step, helping students and developers understand DSA concepts with clear, animated representations.",
    tags: ["Python", "DSA", "Visualization"],
  },
  {
    icon: Wallet,
    cat: "Software",
    title: "Family Expense Management App",
    desc: "A comprehensive application to track household expenses including groceries, utilities and daily spending. Provides budgeting insights and financial organization tools.",
    tags: ["Python", "Database", "Finance"],
  },
  {
    icon: Bot,
    cat: "AI / ML",
    title: "Facial Identification Project",
    desc: "Contributed to a team-based facial recognition system, gaining hands-on experience in computer vision techniques, collaborative development workflows and real-world AI applications.",
    tags: ["Computer Vision", "Team Project", "AI"],
  },
];

const ProjectsSection = () => (
  <section id="projects" className="py-24">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-3">
        Featured <span className="text-gradient-gold">Work</span>
      </h2>
      <p className="text-center text-muted-foreground mb-14">Real-world applications built to solve practical problems.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.title} className="group bg-gradient-card rounded-2xl p-6 shadow-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
              <p.icon className="text-primary" size={22} />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-primary mb-2">{p.cat}</span>
            <h3 className="font-serif font-semibold text-lg mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 text-justify flex-1">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {p.tags.map((t) => (
                <span key={t} className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
