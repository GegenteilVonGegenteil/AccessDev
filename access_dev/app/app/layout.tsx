import Footer from "@/components/footer";
import Header from "@/components/ui/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col gap-12">
      <div className="w-full">
        <Header />
      </div>
      <main className="w-full flex-1 justify-center flex">
        <div className=" w-3/4">
          {children}
        </div>
      </main>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
