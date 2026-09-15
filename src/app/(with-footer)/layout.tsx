import { Footer } from "@/components/footer";

export default function WithFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
