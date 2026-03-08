"use client";

import { Button } from "@/components/ui/button";

export function ScrollButton({
  targetId,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { targetId: string }) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", `#${targetId}`);
    }
  };
  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}