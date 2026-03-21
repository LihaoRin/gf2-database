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

      const targetWidth = Math.ceil(target.scrollWidth || target.clientWidth);
      const targetHeight = Math.ceil(target.scrollHeight || target.clientHeight);

      const canvas = await html2canvas(target, {
        backgroundColor: "#0a0e13",
        scale: Math.max(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
        imageTimeout: 0,
        width: targetWidth,
        height: targetHeight,
        windowWidth: targetWidth,
        windowHeight: targetHeight,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (clonedDocument) => {
          clonedDocument.documentElement.classList.add("export-mode");
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
