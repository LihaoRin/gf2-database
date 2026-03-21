import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/lib/types";

type CharacterCardProps = {
  character: Character;
};

export default function CharacterCard({ character }: CharacterCardProps) {
  const displayName = character.name.ja || character.name.zh;

  return (
    <Link
      href={`/characters/${character.id}`}
      className="group block overflow-hidden border border-[var(--gf2-line-strong)] bg-[linear-gradient(180deg,rgba(11,15,20,0.98),rgba(14,18,24,0.98))] shadow-[0_16px_34px_var(--gf2-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(240,137,67,0.48)] hover:shadow-[0_20px_46px_var(--gf2-shadow)] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]"
    >
      <article>
        <div className="relative aspect-[3/4] overflow-hidden bg-[linear-gradient(180deg,rgba(15,20,26,0.98),rgba(7,10,14,0.98))]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),rgba(0,0,0,0.16))]" />
          <div className="absolute left-0 top-0 z-[2] h-full w-[8px] bg-[linear-gradient(180deg,var(--gf2-accent),rgba(240,137,67,0.08))] opacity-0 transition duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-4 bottom-4 z-[2] h-px bg-gradient-to-r from-transparent via-[rgba(240,137,67,0.76)] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <Image
            src={character.image}
            alt={character.name.en}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="space-y-1.5 border-t border-[var(--gf2-line)] bg-[rgba(8,11,15,0.92)] px-4 py-3">
          <div>
            <h2 className="text-base font-bold tracking-[0.02em] text-[var(--gf2-text)] sm:text-[1.05rem]">
              {displayName}
            </h2>
          </div>
        </div>
      </article>
    </Link>
  );
}
