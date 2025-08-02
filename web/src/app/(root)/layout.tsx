import { SignedIn } from "@clerk/nextjs";
import { Header } from "./components/header";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Readonly<Props>) {
  return (
    <SignedIn>
      <Header />
      <MaxWidthWrapper className="w-full h-[calc(100vh-4rem)]">
        {children}
      </MaxWidthWrapper>
    </SignedIn>
  );
}
