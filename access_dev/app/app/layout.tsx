"use client"

import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

// layout to add header and footer to all pages (besides landing)
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex flex-col gap-12">
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
