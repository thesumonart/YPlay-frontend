import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/layout/MainContent";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { Sidebar } from "@/components/layout/Sidebar";
import "@/styles/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "YPlay", template: "%s · YPlay" },
  description: "A premium video streaming platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-text antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavigationProgress />
          <Header />
          <Sidebar />
          <MobileSidebar />
          <MainContent>{children}</MainContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
