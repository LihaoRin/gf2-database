import CharacterCard from "@/components/CharacterCard";
import type { Character } from "@/lib/types";

type CharacterGridProps = {
  characters: Character[];
};

export default function CharacterGrid({ characters }: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className="border border-dashed border-[var(--gf2-line-strong)] bg-[rgba(10,17,26,0.72)] px-6 py-12 text-center text-[var(--gf2-text-soft)] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]">
        該当なし
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </section>
  );
}
