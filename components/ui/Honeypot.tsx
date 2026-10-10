type HoneypotProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

/** Champ leurre hors écran : un robot le remplit, l'API rejette alors la demande. */
export function Honeypot({ id, value, onChange }: HoneypotProps) {
  return (
    <div className="honeypot" aria-hidden="true">
      <label htmlFor={id}>Company</label>
      <input
        id={id}
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
