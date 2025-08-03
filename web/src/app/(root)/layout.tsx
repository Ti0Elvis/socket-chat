import { SignedIn } from "@clerk/nextjs";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Readonly<Props>) {
  return (
    <SignedIn>
      <MaxWidthWrapper className="w-full min-h-[calc(100vh-4rem)]">
        {children}
      </MaxWidthWrapper>
    </SignedIn>
  );
}
