const groups: { title: string; items: { name: string; percent: number }[] }[] = [
  {
    title: "Programming Languages",
    items: [
      { name: "Python", percent: 80 },
      { name: "Java", percent: 65 },
      { name: "C", percent: 70 },
      { name: "C++", percent: 65 },
    ],
  },
  {
    title: "Web Technologies",
    items: [
      { name: "HTML", percent: 85 },
      { name: "CSS", percent: 75 },
    ],
  },
  {
    title: "Databases",
    items: [{ name: "MySQL", percent: 70 }],
  },
  {
    title: "Core Concepts",
    items: [
      { name: "Data Structures & Algorithms", percent: 75 },
      { name: "Problem Solving", percent: 80 },
      { name: "Logical Thinking", percent: 85 },
    ],
  },
  {
    title: "Digital Marketing",
    items: [
      { name: "Facebook Page Management", percent: 85 },
      { name: "Instagram Management", percent: 80 },
      { name: "WhatsApp Business", percent: 75 },
      { name: "YouTube SEO", percent: 70 },
      { name: "Canva Design", percent: 80 },
      { name: "Facebook Ads", percent: 55 },
    ],
  },
  {
    title: "Other Skills",
    items: [
      { name: "Prompt Engineering", percent: 75 },
      { name: "English Communication", percent: 70 },
    ],
  },
];

const SkillsSection = () => (
  <section id="skills" className="py-24">
    <div className="container mx-auto px-6 max-w-6xl">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-3">
        My <span className="text-gradient-gold">Skills</span>
      </h2>
      <p className="text-center text-muted-foreground mb-14">A balance of engineering, design and digital marketing skills.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((g) => (
          <div key={g.title} className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card hover:border-primary/40 transition-colors">
            <h3 className="text-lg font-serif font-semibold text-gradient-gold mb-5">{g.title}</h3>
            <div className="space-y-4">
              {g.items.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="text-foreground font-medium">{s.name}</span>
                    <span className="text-primary">{s.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-gold transition-all duration-1000" style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
