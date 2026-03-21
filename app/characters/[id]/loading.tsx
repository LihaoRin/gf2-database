export default function CharacterDetailLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,7,11,0.96)]">
      <div className="w-full max-w-6xl px-6">
        <div className="border border-[rgba(255,255,255,0.08)] bg-[rgba(10,14,19,0.94)] px-8 py-8 [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]">
          <div className="h-2 w-full overflow-hidden bg-[rgba(255,255,255,0.08)]">
            <div className="h-full w-[62%] bg-[linear-gradient(90deg,#f08943,#ffb066)] animate-pulse" />
          </div>
          <div className="mt-6 flex items-center justify-between gap-6">
            <p className="text-3xl font-bold tracking-[0.04em] text-[var(--gf2-text)]">
              LOADING - 62%
            </p>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--gf2-text-soft)]">
              CHARACTER PROFILE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
