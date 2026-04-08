import { BookOpen } from "lucide-react";

const books = [
  "From Village to Virtual: The Journey of MD. Shinha Sarder",
  "ICT Fundamentals for the 21st Century Learn",
  "Social Media Learner: Simple Guide",
  "Lifestyle of MD. Shinha Sarder",
  "The Musical Journey of MD. Shinha Sarder",
  "Mastering The Google Knowledge Panel",
  "The Musical Artist As a Shinha",
  "The Entrepreneur as a MD. Shinha Sarder",
];

const BooksSection = () => (
  <section id="books" className="py-24">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-16">
        Books <span className="text-gradient-gold">Collection</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {books.map((b) => (
          <div
            key={b}
            className="group bg-gradient-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all hover:-translate-y-1 duration-300"
          >
            <BookOpen size={24} className="text-primary mb-3" />
            <h4 className="text-sm font-medium text-foreground leading-snug">{b}</h4>
            <p className="text-xs text-muted-foreground mt-1">2025</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BooksSection;
