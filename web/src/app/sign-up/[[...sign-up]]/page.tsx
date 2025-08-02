import { SignedOut, SignUp } from "@clerk/nextjs";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default async function Page() {
  return (
    <MaxWidthWrapper className="w-full h-screen flex items-center justify-center">
      <SignedOut>
        <SignUp
          forceRedirectUrl="/rooms"
          afterSignOutUrl="/rooms"
          fallbackRedirectUrl="/rooms"
        />
      </SignedOut>
    </MaxWidthWrapper>
  );
}
