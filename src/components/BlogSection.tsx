import { ArrowRight } from "lucide-react";

const posts = [
  {
    title: "Create Wi-Fi Track Using Python Code",
    tags: ["Project", "Technology"],
    date: "Apr 4, 2026",
    excerpt: "Instructions to create and edit Python code in VS Code for Wi-Fi tracking.",
  },
  {
    title: "The Best Ways to Learn Code",
    tags: ["Project"],
    date: "Apr 1, 2026",
    excerpt: "A focus on personal growth, entrepreneurship, and coding in the tech landscape.",
  },
  {
    title: "Wiki Page Globalpedia Project",
    tags: ["Project"],
    date: "Mar 30, 2026",
    excerpt: "Globalpedia aims to become the premier digital encyclopedia.",
  },
  {
    title: "Biostar TV World Project",
    tags: ["Project", "Technology"],
    date: "Mar 30, 2026",
    excerpt: "Advanced online IPTV streaming platform for seamless live television access.",
  },
  {
    title: "Bangladeshi Developer Unveils Biostar TV World",
    tags: ["Biography", "News"],
    date: "Feb 17, 2026",
    excerpt: "A significant stride for local digital entertainment solutions.",
  },
  {
    title: "Rising Digital Streaming Innovator",
    tags: ["Biography", "News"],
    date: "Jan 31, 2026",
    excerpt: "Gaining attention in the online streaming space as a creative developer.",
  },
];

const BlogSection = () => (
  <section id="blog" className="py-24">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-16">
        Latest <span className="text-gradient-gold">Posts</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article
            key={p.title}
            className="group bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/40 transition-all hover:-translate-y-1 duration-300"
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
            <h4 className="font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {p.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{p.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{p.date}</span>
              <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default BlogSection;
