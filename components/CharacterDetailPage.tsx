"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type {
  Character,
  CharacterDetail,
  CharacterDetailGalleryGroup,
  CharacterDetailGalleryImage
} from "@/lib/types";
import PdfDownloadButton from "@/components/PdfDownloadButton";

type CharacterDetailPageProps = {
  character: Character;
  detail: CharacterDetail;
  galleries: CharacterDetailGalleryGroup[];
  weaponImages: string[];
  initialCharacterImageMeta?: GalleryImageMeta | null;
};

type LightboxImage = {
  src: string;
  alt: string;
  shouldScale: boolean;
};

type GalleryImageMeta = {
  width: number;
  height: number;
};

function shouldDoubleScaleImage(width: number, height: number) {
  return width > 1500 || height > 1500;
}

function getDoubleScaledImageStyle(
  image: CharacterDetailGalleryImage,
  isReferenceGallery: boolean,
  enableLargeScale: boolean
): CSSProperties | undefined {
  if (!enableLargeScale || !shouldDoubleScaleImage(image.width, image.height)) {
    return undefined;
  }

  const maxWidth = isReferenceGallery ? 620 : 460;
  const maxHeight = isReferenceGallery ? 620 : 520;
  const width = Math.max(Math.min(Math.round(image.width / 2), maxWidth), 180);
  const height = Math.max(Math.min(Math.round(image.height / 2), maxHeight), 240);

  return {
    width: `${width}px`,
    height: `${height}px`,
    maxWidth: "none",
    maxHeight: "none"
  };
}

function extractNumericStem(value: string) {
  const match = value.match(/(\d+)(?!.*\d)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function getGalleryGroupSortKey(folderName: string): [number, number, string] {
  if (folderName === "図鑑") {
    return [0, 0, folderName];
  }

  const skinMatch = /^Skin(\d+)$/i.exec(folderName);
  if (skinMatch) {
    return [1, Number(skinMatch[1]), folderName];
  }

  if (folderName === "他の参考画像") {
    return [2, 0, folderName];
  }

  return [3, 0, folderName];
}

function sortGalleryGroups(groups: CharacterDetailGalleryGroup[]) {
  return [...groups].sort((a, b) => {
    const [groupA, orderA, textA] = getGalleryGroupSortKey(a.folderName);
    const [groupB, orderB, textB] = getGalleryGroupSortKey(b.folderName);

    if (groupA !== groupB) {
      return groupA - groupB;
    }

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return textA.localeCompare(textB, "ja");
  });
}

function sortGalleryImages(images: CharacterDetailGalleryImage[]) {
  return [...images].sort((a, b) => {
    const orderDiff = extractNumericStem(a.src) - extractNumericStem(b.src);
    if (orderDiff !== 0) {
      return orderDiff;
    }

    return a.src.localeCompare(b.src, "ja");
  });
}

function resolveImage(src: string, fallback: string) {
  return src || fallback;
}

function resolveText(value: string, fallback: string) {
  return value || fallback;
}

function parseThemeColors(value: string) {
  return value
    .split(",")
    .map((color) => color.trim())
    .filter((color) => /^#?[0-9a-fA-F]{6}$/.test(color))
    .slice(0, 3)
    .map((color) => (color.startsWith("#") ? color : `#${color}`));
}

function getThemeColorTextColor(color: string) {
  const normalized = color.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  return luminance > 0.62 ? "#0b0f14" : "#f4f7fb";
}

function sanitizeDownloadName(value: string) {
  return value
    .replace(/[<>:"/\\|?*]/g, "")
    .trim();
}

const MISSING_TEXT = "補足待ち";

function DetailGallerySection({
  group,
  onOpen
}: {
  group: CharacterDetailGalleryGroup;
  onOpen: (image: LightboxImage) => void;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [loadedImageSizes, setLoadedImageSizes] = useState<
    Record<string, GalleryImageMeta>
  >({});
  const isReferenceGallery = group.folderName === "他の参考画像";
  const enableLargeScale = true;
  const galleryImageRatios = Object.fromEntries(
    group.images.map((image, index) => {
      const resolvedImage = loadedImageSizes[image.src] ?? image;
      return [index, resolvedImage.width / Math.max(resolvedImage.height, 1)];
    })
  ) as Record<number, number>;
  const galleryImageMeta = Object.fromEntries(
    group.images.map((image, index) => [
      index,
      loadedImageSizes[image.src] ?? { width: image.width, height: image.height }
    ])
  ) as Record<number, GalleryImageMeta>;

  function resolveImageMeta(image: CharacterDetailGalleryImage) {
    return loadedImageSizes[image.src] ?? image;
  }

  function getReferenceImageClass(image: CharacterDetailGalleryImage) {
    const resolvedImage = resolveImageMeta(image);
    const ratio = resolvedImage.width / Math.max(resolvedImage.height, 1);
    const isDoubleScaled =
      enableLargeScale &&
      shouldDoubleScaleImage(resolvedImage.width, resolvedImage.height);

    if (!ratio) {
      return isDoubleScaled ? "h-auto w-auto" : "max-h-[420px] max-w-[420px]";
    }

    if (ratio >= 2.2) {
      return isDoubleScaled ? "h-auto w-auto" : "max-h-[280px] w-full";
    }

    if (ratio >= 1.25) {
      return isDoubleScaled ? "h-auto w-auto" : "max-h-[360px] w-full";
    }

    if (ratio >= 0.85) {
      return isDoubleScaled ? "h-auto w-auto" : "max-h-[420px] max-w-[420px]";
    }

    return isDoubleScaled ? "h-auto w-auto" : "max-h-[520px] max-w-[320px]";
  }

  function getGalleryCardClass() {
    const ratios = Object.values(galleryImageRatios);
    const count = shouldStackLeadingImages() ? group.images.length - 1 : group.images.length;

    if (ratios.length === 0 || count <= 0) {
      return "min-h-[210px]";
    }

    const widestRatio = Math.max(...ratios);
    const tallestRatio = Math.min(...ratios);

    if (count >= 5) {
      if (widestRatio >= 1.2) {
        return "min-h-[205px]";
      }

      if (tallestRatio <= 0.72) {
        return "min-h-[235px]";
      }

      return "min-h-[220px]";
    }

    if (count === 4) {
      if (widestRatio >= 1.2) {
        return "min-h-[220px]";
      }

      if (tallestRatio <= 0.72) {
        return "min-h-[250px]";
      }

      return "min-h-[235px]";
    }

    if (widestRatio >= 1.2) {
      return "min-h-[235px]";
    }

    if (tallestRatio <= 0.72) {
      return "min-h-[265px]";
    }

    return "min-h-[245px]";
  }

  function getGalleryImageClass(image: CharacterDetailGalleryImage) {
    const resolvedImage = resolveImageMeta(image);

    if (
      enableLargeScale &&
      shouldDoubleScaleImage(resolvedImage.width, resolvedImage.height)
    ) {
      return "h-auto w-auto";
    }

    return "max-h-[360px] w-full";
  }

  function getLargeImageCardClass(image: CharacterDetailGalleryImage) {
    const resolvedImage = resolveImageMeta(image);

    if (
      !enableLargeScale ||
      !shouldDoubleScaleImage(resolvedImage.width, resolvedImage.height)
    ) {
      return "";
    }

    const ratio = resolvedImage.width / Math.max(resolvedImage.height, 1);

    if (ratio <= 0.45) {
      return "min-h-[480px]";
    }

    if (ratio >= 2.2) {
      return "min-h-[320px]";
    }

    return "min-h-[420px]";
  }

  function getGalleryGridClass() {
    const count = shouldStackLeadingImages() ? group.images.length - 1 : group.images.length;

    if (count <= 1) {
      return "grid-cols-1";
    }

    if (count === 2) {
      return "md:grid-cols-2";
    }

    if (count === 3) {
      return "md:grid-cols-2 xl:grid-cols-3";
    }

    if (count === 4) {
      return "md:grid-cols-2 xl:grid-cols-4";
    }

    if (count === 5) {
      return "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
    }

    return "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
  }

  function shouldStackLeadingImages() {
    if (isReferenceGallery || group.images.length < 2) {
      return false;
    }

    const first = galleryImageMeta[0];
    const second = galleryImageMeta[1];

    if (!first || !second) {
      return false;
    }

    const firstSmall = Math.max(first.width, first.height) < 500;
    const secondSmall = Math.max(second.width, second.height) < 500;

    return firstSmall || secondSmall;
  }

  const stackLeadingImages = shouldStackLeadingImages();
  const galleryCardClass = getGalleryCardClass();

  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement) {
      return;
    }

    const nextSizes: Record<string, GalleryImageMeta> = {};
    const images = sectionElement.querySelectorAll<HTMLImageElement>(
      "img[data-gallery-src]"
    );

    images.forEach((imageElement) => {
      const src = imageElement.dataset.gallerySrc;

      if (!src || !imageElement.complete) {
        return;
      }

      const { naturalWidth, naturalHeight } = imageElement;

      if (!naturalWidth || !naturalHeight) {
        return;
      }

      nextSizes[src] = {
        width: naturalWidth,
        height: naturalHeight
      };
    });

    if (Object.keys(nextSizes).length === 0) {
      return;
    }

    setLoadedImageSizes((current) => ({
      ...nextSizes,
      ...current
    }));
  }, [group.images]);

  function renderGalleryButton(
    image: CharacterDetailGalleryImage,
    index: number,
    extraClassName?: string
  ) {
    return (
      <button
        type="button"
        key={`${group.folderName}-${index}`}
        data-export-key={`gallery-card-${group.folderName}-${index}`}
        onClick={() =>
          onOpen({
            src: image.src,
            alt: `${group.title}-${index + 1}`,
            shouldScale: shouldDoubleScaleImage(
              resolveImageMeta(image).width,
              resolveImageMeta(image).height
            )
          })
        }
        className={`gf2-media-frame flex items-center justify-center overflow-hidden border border-[var(--gf2-line)] p-4 transition hover:border-[var(--gf2-accent)] ${
          isReferenceGallery ? "min-h-[320px]" : galleryCardClass
        } ${getLargeImageCardClass(image)} ${extraClassName ?? ""}`}
      >
        <img
          src={image.src}
          alt={`${group.title}-${index + 1}`}
          data-export-key={`gallery-image-${group.folderName}-${index}`}
          data-export-enlarged={
            shouldDoubleScaleImage(
              resolveImageMeta(image).width,
              resolveImageMeta(image).height
            )
              ? "true"
              : undefined
          }
          data-gallery-src={image.src}
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            setLoadedImageSizes((current) => {
              const existing = current[image.src];

              if (
                existing?.width === naturalWidth &&
                existing?.height === naturalHeight
              ) {
                return current;
              }

              return {
                ...current,
                [image.src]: {
                  width: naturalWidth,
                  height: naturalHeight
                }
              };
            });
          }}
          style={getDoubleScaledImageStyle(
            resolveImageMeta(image),
            isReferenceGallery,
            enableLargeScale
          )}
          className={`h-auto transform-gpu object-contain ${
            isReferenceGallery
              ? getReferenceImageClass(image)
              : getGalleryImageClass(image)
          }`}
        />
      </button>
    );
  }

  return (
    <section className="gf2-gallery border border-[var(--gf2-line-strong)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
      <div className="gf2-titlebar border-b border-[var(--gf2-line)] px-4 py-2 text-sm font-semibold tracking-[0.08em] text-[var(--gf2-text)]">
        <span className="gf2-titlebar-text">
        {group.title}
        </span>
      </div>
      <div
        data-export-key={`gallery-grid-${group.folderName}`}
        ref={sectionRef}
        className={`grid gap-4 p-4 ${
          isReferenceGallery
            ? "grid-cols-1"
            : getGalleryGridClass()
        }`}
      >
        {stackLeadingImages ? (
          <div
            data-export-key={`gallery-stack-${group.folderName}`}
            className={`grid content-start gap-4 ${galleryCardClass}`}
          >
            {renderGalleryButton(group.images[0], 0, "min-h-0 h-full")}
            {renderGalleryButton(group.images[1], 1, "min-h-0 h-full")}
          </div>
        ) : null}
        {group.images.map((image, index) => {
          if (stackLeadingImages && index < 2) {
            return null;
          }

          return renderGalleryButton(image, index);
        })}
      </div>
    </section>
  );
}

export default function CharacterDetailPage({
  character,
  detail,
  galleries,
  weaponImages,
  initialCharacterImageMeta
}: CharacterDetailPageProps) {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const [shouldScaleCharacterImage, setShouldScaleCharacterImage] = useState(
    Boolean(
      initialCharacterImageMeta &&
      shouldDoubleScaleImage(
        initialCharacterImageMeta.width,
        initialCharacterImageMeta.height
      )
    )
  );
  const displayName = character.name.ja || character.name.zh;
  const profileTitle = resolveText(detail.profileTitle, displayName);
  const downloadName = sanitizeDownloadName(character.name.ja || profileTitle || `character-${character.id}`);
  const overview = resolveText(
    detail.overview,
    MISSING_TEXT
  );
  const themeColorValue = resolveText(detail.themeColor, "#F08943");
  const themeColors = parseThemeColors(themeColorValue);

  const primaryInfo = [
    {
      label: "中国語/English",
      value: [character.name.zh, character.name.en]
        .filter((value) => value)
        .join(" / ")
    },
    {
      label: "声優",
      value: resolveText(detail.voiceActor, MISSING_TEXT)
    },
    {
      label: "身長",
      value: resolveText(detail.height, MISSING_TEXT)
    },
    {
      label: "テーマカラー",
      value: themeColorValue
    }
  ];

  const galleryGroups = sortGalleryGroups(galleries)
    .map((group) => ({
      ...group,
      images: sortGalleryImages(group.images)
    }))
    .filter((group) => group.images.length > 0);
  const resolvedWeaponImage =
    weaponImages[0] || resolveImage(detail.weaponImage, "");
  const shouldShowWeapon =
    weaponImages.length > 0 ||
    Boolean(
      detail.weaponName ||
      detail.weaponNameZh ||
      detail.weaponNameEn ||
      detail.weaponDescription ||
      detail.equipmentNote
    );

  useEffect(() => {
    if (!lightboxImage) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  return (
    <main
      id="character-detail-page-export"
      className="gf2-detail-page mx-auto min-h-screen max-w-[1760px] px-4 py-4 sm:px-5 lg:px-6 lg:py-6"
    >
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="gf2-action border border-[var(--gf2-line-strong)] px-4 py-2 text-sm font-medium text-[var(--gf2-text)] transition hover:border-[var(--gf2-accent)] hover:text-white [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]"
        >
          一覧へ戻る
        </Link>
      </div>

      <section
        id="character-detail-export"
        className="gf2-detail-shell border border-[var(--gf2-line-strong)] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,24px_100%,0_calc(100%-24px))]"
      >
        <div className="gf2-detail-header border-b border-[var(--gf2-line)] px-5 py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="gf2-hero-copy">
              <p className="gf2-kicker text-sm uppercase tracking-[0.28em] text-[var(--gf2-text-soft)]">
                キャラクタープロフィール
              </p>
              <h1 className="gf2-hero-name mt-5 text-3xl font-black text-[var(--gf2-text)] sm:text-4xl">
                {profileTitle}
              </h1>
            </div>
            <PdfDownloadButton
              targetId="character-detail-page-export"
              fileName={`gf2-character-${downloadName}`}
            />
          </div>
        </div>

        <div className="gf2-titlebar border-b border-[var(--gf2-line)] px-5 py-2 text-sm font-semibold tracking-[0.08em] text-[var(--gf2-text)]">
          <span className="gf2-titlebar-text">キャラ紹介</span>
        </div>
        <div className="gf2-overview border-b border-[var(--gf2-line)] px-5 py-5 text-[15px] font-medium leading-8 text-[rgba(232,236,242,0.88)]">
          {overview}
        </div>

        <div className="border-b border-[var(--gf2-line)] px-5 py-4">
          <div className="grid gap-2 md:grid-cols-4">
            {primaryInfo.map((item, index) => (
              <div
                key={item.label}
                className="gf2-card border border-[var(--gf2-line)] px-3 py-2"
              >
                <p className="gf2-card-label text-sm font-semibold tracking-[0.14em]">
                  {item.label}
                </p>
                {index === 3 ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                      {(themeColors.length > 0 ? themeColors : ["#F08943"]).map((color) => (
                        <span
                          key={color}
                          className="inline-flex h-8 min-w-[84px] items-center justify-center border border-[rgba(255,255,255,0.15)] px-2 text-[11px] font-bold tracking-[0.04em]"
                          style={{
                            backgroundColor: color,
                            color: getThemeColorTextColor(color)
                          }}
                        >
                          {color}
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-[var(--gf2-text)]">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          data-export-key="detail-main-grid"
          className="grid gap-6 p-5 lg:grid-cols-[360px_minmax(0,1fr)]"
        >
          <div className="space-y-4">
            <div
              data-export-key="character-portrait-frame"
              className="gf2-character-portrait-frame gf2-media-frame flex aspect-[7/10] w-full items-center justify-center overflow-hidden border border-[var(--gf2-line-strong)]"
              style={{ aspectRatio: "7 / 10" }}
            >
              <img
                src={character.image}
                alt={displayName}
                data-export-key="character-portrait-image"
                data-export-enlarged={shouldScaleCharacterImage ? "true" : undefined}
                onLoad={(event) =>
                  setShouldScaleCharacterImage(
                    shouldDoubleScaleImage(
                      event.currentTarget.naturalWidth,
                      event.currentTarget.naturalHeight
                    )
                  )
                }
                className={`gf2-character-portrait-image h-full w-full object-contain ${
                  shouldScaleCharacterImage ? "scale-[2]" : ""
                }`}
              />
            </div>
          </div>

          <div data-export-key="detail-gallery-column" className="space-y-5">
            {galleryGroups.map((group) => (
              <DetailGallerySection
                key={group.folderName}
                group={group}
                onOpen={setLightboxImage}
              />
            ))}

            {shouldShowWeapon ? (
              <section className="gf2-gallery border border-[var(--gf2-line-strong)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
                <div className="gf2-titlebar border-b border-[var(--gf2-line)] px-4 py-2 text-sm font-semibold tracking-[0.08em] text-[var(--gf2-text)]">
                  <span className="gf2-titlebar-text">武器</span>
                </div>
                <div
                  data-export-key="weapon-section-grid"
                  className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]"
                >
                  <button
                    type="button"
                    data-export-key="weapon-frame"
                    onClick={() =>
                      setLightboxImage({
                        src: resolvedWeaponImage || character.image,
                        alt: resolveText(detail.weaponName, displayName),
                        shouldScale: false
                      })
                    }
                    className="gf2-weapon-frame gf2-media-frame flex aspect-[4/3] w-full items-center justify-center overflow-hidden border border-[var(--gf2-line)] transition hover:border-[var(--gf2-accent)]"
                  >
                    <img
                      src={resolvedWeaponImage || character.image}
                      alt={resolveText(detail.weaponName, displayName)}
                      data-export-key="weapon-image"
                      data-export-enlarged={
                        shouldDoubleScaleImage(
                          initialCharacterImageMeta?.width ?? 0,
                          initialCharacterImageMeta?.height ?? 0
                        )
                          ? "true"
                          : undefined
                      }
                      className="gf2-weapon-image h-full w-full object-contain"
                    />
                  </button>
                  <div className="space-y-4">
                    <div>
                      <p className="gf2-card-label text-sm font-semibold tracking-[0.14em]">
                        武器名
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-[var(--gf2-text)]">
                        {resolveText(detail.weaponName, MISSING_TEXT)}
                      </h2>
                    </div>
                    <p className="text-sm font-medium leading-7 text-[var(--gf2-text-soft)]">
                      中国語/English
                    </p>
                    <div className="gf2-card border border-[var(--gf2-line)] p-4 text-sm text-[var(--gf2-text-soft)]">
                      {resolveText(detail.equipmentNote, MISSING_TEXT)}
                    </div>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>

      {lightboxImage ? (
        <div
          className="gf2-modal fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="gf2-modal-panel relative max-h-[92vh] w-full max-w-[1400px] border border-[var(--gf2-line-strong)] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="gf2-action mb-4 ml-auto block border border-[var(--gf2-line)] px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[var(--gf2-text-soft)] transition hover:border-[var(--gf2-accent)] hover:text-[var(--gf2-text)]"
            >
              閉じる
            </button>
            <div className="flex max-h-[80vh] items-center justify-center overflow-auto">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="gf2-lightbox-image h-auto max-h-[80vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
