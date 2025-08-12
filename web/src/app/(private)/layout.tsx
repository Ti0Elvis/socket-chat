import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { is_registered_current_user_on_api } from "../actions";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

interface Props {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default async function Layout({ children }: Readonly<Props>) {
  const response = await is_registered_current_user_on_api();

  if (response.ok === false) {
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
