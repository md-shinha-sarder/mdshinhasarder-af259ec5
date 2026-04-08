import { User, MapPin, Flag, Building, GraduationCap } from "lucide-react";

const info = [
  { icon: User, label: "Full Name", value: "MD. Shinha Sarder" },
  { icon: MapPin, label: "Birth Place", value: "Shirgati Village, Aichgati Union, Khulna" },
  { icon: Flag, label: "Nationality", value: "Bangladeshi" },
  { icon: Building, label: "Known For", value: "Entrepreneur, Musical Artist & Author" },
  { icon: Building, label: "Organizations", value: "IT Tech BD, Biostar TV World" },
];

const education = [
  "Northern University of Business and Technology, Khulna",
  "Ahsanullah College, Khulna",
  "Khulna Zilla School",
];

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4">
        About <span className="text-gradient-gold">Me</span>
      </h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
        MD. Shinha Sarder is the Founder & CEO of IT Tech BD and Biostar TV World, born on 5 November 2004 in Khulna, Bangladesh. He is an Engineer, Developer, Entrepreneur, Musical Artist, Author, Researcher, YouTuber and Content Creator. Currently studying CSE at Northern University of Business and Technology, Khulna.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-card rounded-xl p-8 shadow-card border border-border">
          <h3 className="text-xl font-serif font-semibold mb-6 text-gradient-gold">Personal Info</h3>
          <div className="space-y-4">
            {info.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <item.icon size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-card rounded-xl p-8 shadow-card border border-border">
          <h3 className="text-xl font-serif font-semibold mb-6 text-gradient-gold flex items-center gap-2">
            <GraduationCap size={20} /> Education
          </h3>
          <div className="space-y-4">
            {education.map((e, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-foreground">{e}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-serif font-semibold mt-8 mb-4 text-gradient-gold">Music Genre</h3>
          <p className="text-muted-foreground">Soundtracks, Country</p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
