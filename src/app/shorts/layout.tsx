export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Escape MainContent's padding (px-4 py-6 md:px-6 lg:px-8, max-w-screen-2xl)
  // so Shorts can fill the full viewport width/height.
  return (
    <div className="-mx-4 -my-6 md:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)]">
      {children}
    </div>
  );
}
