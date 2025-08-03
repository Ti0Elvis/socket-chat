import { SignedOut, SignUp } from "@clerk/nextjs";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default async function Page() {
  return (
    <MaxWidthWrapper className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <SignedOut>
        <SignUp />
      </SignedOut>
    </MaxWidthWrapper>
  );
}
