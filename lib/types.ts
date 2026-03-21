export type Character = {
  id: number;
  image: string;
  name: {
    zh: string;
    ja: string;
    en: string;
  };
};

export type CharacterDetailGalleryImage = {
  src: string;
  width: number;
  height: number;
};

export type CharacterDetailGalleryGroup = {
  title: string;
  folderName: string;
  images: CharacterDetailGalleryImage[];
};

export type CharacterDetail = {
  id: number;
  profileTitle: string;
  archiveCode: string;
  faction: string;
  roleLabel: string;
  illustrator: string;
  voiceActor: string;
  height: string;
  themeColor: string;
  birthplace: string;
  combatStyle: string;
  statusNote: string;
  overview: string;
  weaponName: string;
  weaponNameZh: string;
  weaponNameEn: string;
  weaponImage: string;
  weaponDescription: string;
  equipmentNote: string;
  galleries: CharacterDetailGalleryGroup[];
  weaponImages: string[];
};
