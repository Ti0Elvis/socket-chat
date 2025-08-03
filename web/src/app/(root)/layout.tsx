import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { is_user_registered_with_api } from "./actions";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

interface Props {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default async function Layout({ children }: Readonly<Props>) {
  const { error } = await is_user_registered_with_api();

  if (error !== undefined) {
    redirect("/callback");
  }

  return (
    <SignedIn>
      <MaxWidthWrapper className="w-full min-h-[calc(100vh-4rem)]">
        {children}
      </MaxWidthWrapper>
    </SignedIn>
  );
}
