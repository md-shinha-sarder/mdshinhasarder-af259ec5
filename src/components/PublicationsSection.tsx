const pubs = [
  {
    title: "Graph theory with applications to engineering and computer science",
    publisher: "Courier Dover Publications, 2025",
  },
  {
    title: "Days of a Dreaming Boy: The Early Life of MD. Shinha Sarder",
    publisher: "University Publisher, 2025",
  },
  {
    title: "From Khulna to the Cloud: A Young Creator's Diary",
    publisher: "MD. Shinha Sarder, 2025",
  },
  {
    title: "Computer and Technology: Mastering Modern Tech",
    publisher: "Rafi Publisher Ltd, 2025",
  },
  {
    title: "MD. Shinha Sarder - Biography",
    publisher: "PeoplePill, 2025",
  },
];

const PublicationsSection = () => (
  <section id="publications" className="py-24">
    <div className="container mx-auto px-6 max-w-3xl">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-16">
        <span className="text-gradient-gold">Publications</span>
      </h2>

      <div className="space-y-4">
        {pubs.map((p) => (
          <div
            key={p.title}
            className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/40 transition-all"
          >
            <h4 className="font-medium text-foreground mb-1">{p.title}</h4>
            <p className="text-sm text-muted-foreground">MDS Sarder · {p.publisher}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PublicationsSection;
