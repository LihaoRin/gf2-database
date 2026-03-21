import CharacterExplorer from "@/components/CharacterExplorer";
import characters from "@/data/characters.json";
import type { Character } from "@/lib/types";

const characterList = characters as Character[];

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1380px] px-4 py-4 sm:px-5 lg:px-6 lg:py-6">
      <section className="relative overflow-hidden border border-[var(--gf2-line-strong)] bg-[var(--gf2-panel-strong)] px-5 py-5 text-[var(--gf2-text)] shadow-[0_24px_70px_var(--gf2-shadow)] [clip-path:polygon(0_0,calc(100%-28px)_0,100%_28px,100%_100%,28px_100%,0_calc(100%-28px))] sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,18,24,0.98),rgba(8,11,16,0.98))]" />
        <div className="absolute inset-y-0 left-0 w-[12px] bg-[linear-gradient(180deg,var(--gf2-accent),rgba(240,137,67,0.08))]" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[rgba(240,137,67,0.44)]" />

        <div className="relative">
          <div>
            <h1 className="max-w-4xl text-3xl font-black tracking-[-0.03em] text-[var(--gf2-text)] sm:text-4xl lg:text-[3.35rem]">
              ドールズフロントライン2
            </h1>
          </div>
        </div>
      </section>

      <section className="relative mt-4 border border-[var(--gf2-line-strong)] bg-[var(--gf2-panel)] p-4 shadow-[0_18px_48px_var(--gf2-shadow)] [clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,22px_100%,0_calc(100%-22px))] sm:p-5">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,19,0.96),rgba(9,12,17,0.98))]" />
        <div className="absolute left-0 top-0 h-full w-[6px] bg-[rgba(240,137,67,0.28)]" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-[rgba(255,255,255,0.04)]" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative">
            <h2 className="text-xl font-bold tracking-[0.01em] text-[var(--gf2-text)] sm:text-2xl">
              キャラ詳細
            </h2>
          </div>
        </div>

        <div className="relative">
          <CharacterExplorer characters={characterList} />
        </div>
      </section>
    </main>
  );
}
