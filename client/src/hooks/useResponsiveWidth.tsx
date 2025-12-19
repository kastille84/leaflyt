import { useEffect, useState } from "react";

export function useResponsiveWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const max_width = {
    s_desktop: 1344,
    l_tablet: 1200,
    m_tablet: 940,
    s_tablet: 704,
    l_mobile: 544,
    s_mobile: 375,
  };

  // return the device type based on the range of the width
  // if (width > max_width.s_desktop) {
  //   return "s_desktop";
  // } else if (width > max_width.l_tablet) {
  //   return "l_tablet";
  // } else if (width > max_width.m_tablet) {
  //   return "m_tablet";
  // } else if (width > max_width.s_tablet) {
  //   return "s_tablet";
  // } else if (width > max_width.l_mobile) {
  //   return "l_mobile";
  // } else {
  //   return "s_mobile";
  // }

  if (width <= max_width.s_mobile) {
    return "s_mobile" as string;
  } else if (width <= max_width.l_mobile) {
    return "l_mobile";
  } else if (width <= max_width.s_tablet) {
    return "s_tablet";
  } else if (width <= max_width.m_tablet) {
    return "m_tablet";
  } else if (width <= max_width.l_tablet) {
    return "l_tablet";
  } else {
    return "s_desktop";
  }
  // return width > max_width.s_desktop
  //   ? "s_desktop"
  //   : width > max_width.l_tablet
  //   ? "l_tablet"
  //   : width > max_width.m_tablet
  //   ? "m_tablet"
  //   : width > max_width.s_tablet
  //   ? "s_tablet"
  //   : width > max_width.l_mobile
  //   ? "l_mobile"
  //   : "s_mobile";
}
