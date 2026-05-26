import { User, MapPin, Flag, Building, GraduationCap, BookOpen } from "lucide-react";

const info = [
  { icon: User, label: "Full Name", value: "MD. Shinha Sarder" },
  { icon: Flag, label: "Born", value: "5 November 2004" },
  { icon: MapPin, label: "Birth Place", value: "Shirgati Village, Aichgati Union, Khulna" },
  { icon: Flag, label: "Nationality", value: "Bangladeshi" },
  { icon: Building, label: "Known For", value: "Engineer, Developer, Entrepreneur, Musical Artist, Author, Researcher, YouTuber, Content Creator" },
  { icon: Building, label: "Organizations", value: "IT Tech BD, Biostar TV World" },
  { icon: User, label: "Father", value: "MD. Lutfor Rahaman (Lawyer)" },
  { icon: User, label: "Mother", value: "Samima Sultana" },
  { icon: User, label: "Religion", value: "Islam" },
];

const education = [
  "Northern University of Business and Technology, Khulna — B.Sc. in Computer Science & Engineering (CSE)",
  "Khulna Zilla School — Former Student",
];

const AboutSection = () => (
  <section id="about" className="py-24 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
    <div className="container mx-auto px-6 relative">
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-2 text-xs text-primary font-medium tracking-widest uppercase mb-3 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
          <BookOpen size={12} /> Personal Story
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
          <span className="text-gradient-gold">Biography</span>
        </h2>
        <p className="text-foreground/90 max-w-3xl mx-auto leading-relaxed text-justify">
          MD. Shinha Sarder is known as the Founder &amp; CEO of IT Tech BD and Biostar TV World who was born on 5 November, 2004. He is also known as an Engineer, Developer, Entrepreneur, Musical Artist, Author, Researcher, YouTuber and Content Creator. He regularly uploads content on YouTube, Facebook and other social media. He is a regular student at the Computer Science and Engineering (CSE) program in the Northern University of Business and Technology, Khulna. He was a former student of Khulna Zilla School. His father (MD. Lutfor Rahaman) is a lawyer. His mother (Samima Sultana) is a private sector employee. He was born into a Muslim family in Shirgati village, Aichgati Union Parishad, Khulna.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-card rounded-2xl p-8 shadow-card border border-border hover:border-primary/40 transition-colors">
          <h3 className="text-xl font-serif font-semibold mb-6 text-gradient-gold">Personal Info</h3>
          <div className="space-y-4">
            {info.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-foreground text-justify">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-card rounded-2xl p-8 shadow-card border border-border hover:border-primary/40 transition-colors">
          <h3 className="text-xl font-serif font-semibold mb-6 text-gradient-gold flex items-center gap-2">
            <GraduationCap size={20} /> Education
          </h3>
          <div className="space-y-4">
            {education.map((e, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-foreground text-justify">{e}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-serif font-semibold mt-8 mb-3 text-gradient-gold">Music Genre</h3>
          <p className="text-foreground/80 text-justify">Soundtracks, Country</p>

          <h3 className="text-xl font-serif font-semibold mt-8 mb-3 text-gradient-gold">Roles</h3>
          <div className="flex flex-wrap gap-2">
            {["Engineer", "Developer", "Entrepreneur", "Musical Artist", "Author", "Researcher", "YouTuber", "Content Creator"].map((r) => (
              <span key={r} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
