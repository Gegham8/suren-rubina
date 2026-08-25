const FOREST = "#C47A5A";

/** Closing line and the big line-art illustration from the reference. */
export default function Footer() {
  return (
    <footer
      className="mx-auto w-full overflow-x-hidden pt-20 text-center"
      style={{ maxWidth: "28rem", color: FOREST, paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <img
        src="/images/art-footer.png"
        alt=""
        draggable={false}
        className="relative left-1/2 mt-6 max-w-none -translate-x-1/2 select-none"
      />
    </footer>
  );
}
