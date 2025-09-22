import { SignedIn } from "@clerk/nextjs";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return <SignedIn>{children}</SignedIn>;
}
