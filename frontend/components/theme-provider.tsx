"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
