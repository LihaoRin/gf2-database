"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

type PngDownloadButtonProps = {
  targetId: string;
  fileName: string;
};

export default function PdfDownloadButton({
  targetId,
  fileName
}: PngDownloadButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  async function handleDownload() {
    const target = document.getElementById(targetId);
    if (!target || isCapturing) {
      return;
    }

    setIsCapturing(true);

    try {
      if ("fonts" in document) {
        await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
      }

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      const targetRect = target.getBoundingClientRect();
      const viewportWidth = Math.ceil(document.documentElement.clientWidth);
      const viewportHeight = Math.ceil(window.innerHeight);
      const targetWidth = Math.ceil(
        targetRect.width || target.clientWidth || target.offsetWidth
      );
      const targetHeight = Math.ceil(
        target.scrollHeight || target.clientHeight || target.offsetHeight
      );
      const frozenElementSizes = Array.from(
        target.querySelectorAll<HTMLElement>("[data-export-key]")
      ).map((element) => {
        const key = element.dataset.exportKey;
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);

        return {
          key,
          tagName: element.tagName,
          exportEnlarged: element.dataset.exportEnlarged === "true",
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height),
          objectFit: computedStyle.objectFit,
          objectPosition: computedStyle.objectPosition,
          display: computedStyle.display
        };
      });

      const canvas = await html2canvas(target, {
        backgroundColor: "#0a0e13",
        scale: Math.max(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
        imageTimeout: 0,
        width: targetWidth,
        height: targetHeight,
        windowWidth: viewportWidth,
        windowHeight: viewportHeight,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (clonedDocument) => {
          clonedDocument.documentElement.classList.add("export-mode");
          const clonedHtml = clonedDocument.documentElement;
          const clonedBody = clonedDocument.body;
          const clonedTarget = clonedDocument.getElementById(targetId);

          clonedHtml.style.width = `${viewportWidth}px`;
          clonedHtml.style.minWidth = `${viewportWidth}px`;
          clonedHtml.style.maxWidth = `${viewportWidth}px`;
          clonedBody.style.width = `${viewportWidth}px`;
          clonedBody.style.minWidth = `${viewportWidth}px`;
          clonedBody.style.maxWidth = `${viewportWidth}px`;
          clonedBody.style.overflow = "hidden";

          if (clonedTarget instanceof HTMLElement) {
            clonedTarget.style.boxSizing = "border-box";
            clonedTarget.style.width = `${targetWidth}px`;
            clonedTarget.style.minWidth = `${targetWidth}px`;
            clonedTarget.style.maxWidth = `${targetWidth}px`;
          }

          frozenElementSizes.forEach(
            ({
              key,
              tagName,
              exportEnlarged,
              width,
              height,
              objectFit,
              objectPosition,
              display
            }) => {
              if (!key || !width || !height) {
                return;
              }

              const clonedElement = clonedDocument.querySelector<HTMLElement>(
                `[data-export-key="${key}"]`
              );

              if (!clonedElement) {
                return;
              }

              clonedElement.style.boxSizing = "border-box";
              clonedElement.style.display = display;

              if (tagName === "IMG") {
                if (exportEnlarged) {
                  clonedElement.style.width = `${width}px`;
                  clonedElement.style.minWidth = `${width}px`;
                  clonedElement.style.maxWidth = `${width}px`;
                  clonedElement.style.height = `${height}px`;
                  clonedElement.style.minHeight = `${height}px`;
                  clonedElement.style.maxHeight = `${height}px`;
                } else {
                  clonedElement.style.width = "auto";
                  clonedElement.style.minWidth = "0";
                  clonedElement.style.maxWidth = "100%";
                  clonedElement.style.height = "auto";
                  clonedElement.style.minHeight = "0";
                  clonedElement.style.maxHeight = "100%";
                }
                clonedElement.style.objectFit = objectFit;
                clonedElement.style.objectPosition = objectPosition;
                clonedElement.style.margin = "auto";
              } else {
                clonedElement.style.width = `${width}px`;
                clonedElement.style.minWidth = `${width}px`;
                clonedElement.style.maxWidth = `${width}px`;
                clonedElement.style.height = `${height}px`;
                clonedElement.style.minHeight = `${height}px`;
                clonedElement.style.maxHeight = `${height}px`;
              }
            }
          );
        },
        ignoreElements: (element) =>
          element instanceof HTMLElement &&
          element.dataset.exportHide === "true"
      });

      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      data-export-hide="true"
      className="gf2-action flex min-w-[140px] flex-col items-center border border-[var(--gf2-line-strong)] px-5 py-4 text-xs text-[var(--gf2-text-soft)] transition hover:border-[var(--gf2-accent)] hover:text-[var(--gf2-text)] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] print:hidden"
      disabled={isCapturing}
    >
      <p className="w-full text-center uppercase tracking-[0.24em]">PNG</p>
      <p className="mt-2 w-full text-center text-lg font-bold text-[var(--gf2-text)]">
        {isCapturing ? "生成中" : "ダウンロード"}
      </p>
    </button>
  );
}
