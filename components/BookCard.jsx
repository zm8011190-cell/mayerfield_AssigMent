import QuantityStepper from "./QuantityStepper";

const coverStyles = {
  forest: "bg-forest text-white",
  plum: "bg-plum text-white",
  navy: "bg-navy text-white",
  rust: "bg-rust text-white",
  mustard: "bg-mustard text-ink",
};

export default function BookCard({ book, quantity, onQuantityChange }) {
  return (
    <article className="flex min-w-0 flex-col gap-1">
      <div
        className={`mb-2 flex aspect-[2/3] items-end rounded-l-sm rounded-r-md border-l-8 border-black/25 p-3 md:p-4 ${coverStyles[book.cover]}`}
      >
        <span className="font-heading text-base font-bold leading-tight md:text-lg">{book.title}</span>
      </div>
      <h3 className="font-heading text-base leading-snug">{book.title}</h3>
      <p className="text-muted">{book.author}</p>
      {book.note && <p className="text-sm italic">"{book.note}"</p>}
      <p className="mt-auto pt-1 font-semibold">${(book.priceCents / 100).toFixed(2)}</p>
      <QuantityStepper value={quantity} onChange={onQuantityChange} label={book.title} />
    </article>
  );
}
