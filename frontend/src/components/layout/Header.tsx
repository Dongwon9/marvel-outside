import HeaderDesktop from "./Header.desktop";
import HeaderMobile from "./Header.mobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Header() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? <HeaderDesktop /> : <HeaderMobile />;
}
