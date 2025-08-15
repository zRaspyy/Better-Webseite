export async function getStaticProps() {
  // ...lade Daten...
  return { props: { /* ... */ }, revalidate: 60 };
}

// Füge einen gültigen Default-Export hinzu
export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-[#ff3c3c]">Über Better Warzone Audio</h1>
      <p className="text-lg text-gray-300">
        Hier findest du alle Infos zur App, zum Team und zu unseren Werten.
      </p>
      {/* ...weitere Inhalte... */}
    </main>
  );
}
