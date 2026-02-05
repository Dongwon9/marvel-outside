import { useMediaQuery } from "@/hooks/useMediaQuery";

import HeaderDesktop from "./Header.desktop";
import HeaderMobile from "./Header.mobile";

export default function Header() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? <HeaderDesktop /> : <HeaderMobile />;
}
