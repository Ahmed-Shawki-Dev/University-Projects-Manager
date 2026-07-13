export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col min-h-screen overflow-hidden p-10 lg:p-20 container mx-auto border-x">
      {children}
    </main>
  );
}
