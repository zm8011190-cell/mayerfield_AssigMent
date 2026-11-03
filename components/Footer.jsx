export default function Footer() {
  return (
    <footer
      id="visit"
      className="flex flex-wrap items-end justify-between gap-6 bg-ink px-5 py-10 text-paper md:px-8"
    >
      <div>
        <h2 className="mb-2 font-heading text-xl">Visit the shop</h2>
        <address className="not-italic">
          214 Alder Street
          <br />
          Open daily, 10 am to 7 pm
        </address>
      </div>
      <p className="text-sm opacity-80">&copy; 2026 Marginalia Books</p>
    </footer>
  );
}
