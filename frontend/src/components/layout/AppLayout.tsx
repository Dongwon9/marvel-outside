import { useMediaQuery } from "../../hooks/useMediaQuery";
import AppLayoutDesktop from "./AppLayout.desktop";
import AppLayoutMobile from "./AppLayout.mobile";

export default function AppLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? <AppLayoutDesktop /> : <AppLayoutMobile />;
}
