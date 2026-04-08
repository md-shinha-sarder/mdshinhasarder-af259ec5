const skills = [
  { name: "HTML / CSS / JS", percent: 30 },
  { name: "Python", percent: 30 },
  { name: "Java", percent: 25 },
  { name: "C / C++", percent: 10 },
  { name: "Others", percent: 5 },
];

const SkillsSection = () => (
  <section id="skills" className="py-24">
    <div className="container mx-auto px-6 max-w-2xl">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-16">
        My <span className="text-gradient-gold">Skills</span>
      </h2>

      <div className="space-y-6">
        {skills.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-foreground font-medium">{s.name}</span>
              <span className="text-primary">{s.percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-gold transition-all duration-1000"
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
