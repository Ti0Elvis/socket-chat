"use client";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/providers/theme.provider";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Readonly<Props>) {
  return (
    <html>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <MaxWidthWrapper className="mt-40 space-y-4">
            <h2 className="text-primary text-4xl font-extrabold md:text-5xl lg:text-6xl">
              Something&#39;s were wrong
            </h2>
            <p className="text-xl text-zinc-800 dark:text-gray-300 md:text-2xl lg:text-3xl">
              Error message: {error.message}
            </p>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={reset}>
                Retry
              </Button>
            </div>
          </MaxWidthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
