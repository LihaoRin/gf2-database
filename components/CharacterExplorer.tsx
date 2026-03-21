"use client";

import { useState } from "react";
import CharacterGrid from "@/components/CharacterGrid";
import SearchBar from "@/components/SearchBar";
import type { Character } from "@/lib/types";

type CharacterExplorerProps = {
  characters: Character[];
};

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

export default function CharacterExplorer({
  characters
}: CharacterExplorerProps) {
  const [keyword, setKeyword] = useState("");

  const normalizedKeyword = normalizeKeyword(keyword);
  const filteredCharacters = characters.filter((character) => {
    return (
      !normalizedKeyword ||
      Object.values(character.name).some((name) =>
        normalizeKeyword(name).includes(normalizedKeyword)
      )
    );
  });

  return (
    <div className="space-y-4">
      <SearchBar value={keyword} onChange={setKeyword} />
      <div className="flex items-center justify-between text-sm text-[var(--gf2-text-soft)]">
        <p className="tracking-[0.08em]">{filteredCharacters.length}キャラ</p>
        <button
          type="button"
          onClick={() => setKeyword("")}
          className="border border-[var(--gf2-line-strong)] bg-[rgba(12,17,23,0.98)] px-4 py-2 font-medium text-[var(--gf2-text)] transition hover:border-[var(--gf2-accent)] hover:bg-[rgba(240,137,67,0.08)] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
        >
          クリア
        </button>
      </div>
      <CharacterGrid characters={filteredCharacters} />
    </div>
  );
}
