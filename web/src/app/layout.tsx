import "./globals.css";
import type { Metadata } from "next";
import { dark } from "@clerk/themes";
import { Roboto } from "next/font/google";
import { Header } from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query.provider";
import { ThemeProvider } from "@/providers/theme.provider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "socket-chat",
};

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "#00bc7d",
          colorPrimaryForeground: "#f0fdf4",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={roboto.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <Header />
              <main className="w-full">{children}</main>
            </QueryProvider>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
