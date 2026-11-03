// Controlled component: no state of its own. The parent passes value and
// onChange, and this component only reports clicks.
export default function QuantityStepper({ value, onChange, label, min = 0, max = 9 }) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Remove one ${label}`}
        className="h-9 w-9 rounded border border-rule bg-white text-lg font-semibold hover:bg-paper disabled:opacity-40"
      >
        -
      </button>
      <output aria-live="polite" className="w-6 text-center font-semibold">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Add one ${label}`}
        className="h-9 w-9 rounded border border-rule bg-white text-lg font-semibold hover:bg-paper disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
