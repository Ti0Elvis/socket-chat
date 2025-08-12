import { RoomSocketProvider } from "./context/socket";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return <RoomSocketProvider>{children}</RoomSocketProvider>;
}
