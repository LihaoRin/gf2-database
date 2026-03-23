export const dynamic = "force-static";

import { notFound } from "next/navigation";
import CharacterDetailPage from "@/components/CharacterDetailPage";
import characters from "@/data/characters.json";
import characterDetails from "@/data/character-details.json";
import { getImageSize } from "@/lib/server-image-size";
import type { Character, CharacterDetail } from "@/lib/types";

const characterList = characters as Character[];
const detailList = characterDetails as CharacterDetail[];

function createFallbackDetail(character: Character): CharacterDetail {
  return {
    id: character.id,
    profileTitle: character.name.ja || character.name.zh,
    archiveCode: `CHAR-${String(character.id).padStart(2, "0")}`,
    faction: "",
    roleLabel: "",
    illustrator: "",
    voiceActor: "",
    height: "",
    themeColor: "#F08943",
    birthplace: "",
    combatStyle: "",
    statusNote: "",
    overview: "",
    weaponName: "",
    weaponNameZh: "",
    weaponNameEn: "",
    weaponImage: "",
    weaponDescription: "",
    equipmentNote: "",
    galleries: [],
    weaponImages: []
  };
}

export default async function CharacterDetailRoute({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const character = characterList.find((entry) => entry.id === numericId);

  if (!character) {
    notFound();
  }

  const detail =
    detailList.find((entry) => entry.id === numericId) ??
    createFallbackDetail(character);
  const [characterImageMeta, hydratedGalleries] = await Promise.all([
    getImageSize(character.image),
    Promise.all(
      detail.galleries.map(async (group) => ({
        ...group,
        images: await Promise.all(
          group.images.map(async (image) => {
            if (image.width > 0 && image.height > 0) {
              return image;
            }

            const imageMeta = await getImageSize(image.src);
            if (!imageMeta) {
              return image;
            }

            return {
              ...image,
              width: imageMeta.width,
              height: imageMeta.height
            };
          })
        )
      }))
    )
  ]);

  return (
    <CharacterDetailPage
      character={character}
      detail={detail}
      galleries={hydratedGalleries}
      weaponImages={detail.weaponImages}
      initialCharacterImageMeta={characterImageMeta}
    />
  );
}
