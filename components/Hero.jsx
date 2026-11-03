const spines = [
  "h-[85%] bg-forest",
  "h-[65%] bg-mustard",
  "h-full bg-plum",
  "h-[75%] bg-navy",
  "h-[90%] bg-rust",
  "h-[60%] bg-forest",
  "h-[80%] bg-ink",
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-6xl items-end gap-8 px-5 py-12 md:grid-cols-2 md:gap-12 md:px-8 md:py-16"
    >
      <div>
        <h1 id="hero-title" className="mb-4 font-heading text-4xl leading-tight md:text-5xl">
          Books worth writing in the margins of.
        </h1>
        <p className="mb-6 max-w-lg text-muted">
          A small shop with a big, well-read shelf. Browse new fiction and nonfiction, ask us what to read next, or join a book club on Thursday nights.
        </p>
        <a
          href="#catalog"
          className="inline-block rounded bg-ink px-6 py-3 font-semibold text-paper hover:bg-plum"
        >
          See what we love
        </a>
      </div>
      <div aria-hidden="true" className="flex h-56 items-end gap-1.5 border-b-8 border-ink px-3 md:h-72">
        {spines.map((classes, i) => (
          <span key={i} className={`max-w-14 flex-1 rounded-t-sm ${classes}`} />
        ))}
      </div>
    </section>
  );
}
