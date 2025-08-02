import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"section"> {
  children: React.ReactNode;
}

export function MaxWidthWrapper({
  className,
  children,
  ...props
}: Readonly<Props>) {
  return (
    <section
      className={cn(
        "w-full max-w-screen-xl h-full mx-auto px-4 sm:px-8 md:px-16",
        className
      )}
      {...props}>
      {children}
    </section>
  );
}
