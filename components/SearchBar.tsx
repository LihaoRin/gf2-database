"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-10 mb-4">
      <div className="border border-[var(--gf2-line-strong)] bg-[rgba(10,14,20,0.94)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_10px_24px_var(--gf2-shadow)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search"
          className="w-full border border-[rgba(255,255,255,0.08)] bg-[rgba(6,9,13,0.92)] px-4 py-2.5 text-[15px] text-[var(--gf2-text)] outline-none transition placeholder:text-[var(--gf2-text-faint)] focus:border-[var(--gf2-accent)] focus:bg-[rgba(8,12,18,0.98)] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
        />
      </div>
    </div>
  );
}
