import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { find_user_on_nestjs_api } from "./actions";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

interface Props {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default async function Layout({ children }: Readonly<Props>) {
  const { error } = await find_user_on_nestjs_api();

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
