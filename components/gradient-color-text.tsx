import { cn } from "@/lib/utils";

/**
 * text with gradient color
 * see: https://tailwindcss.com/docs/background-image#adding-a-linear-gradient
 * @param gradientColor background-image with gradient color
 * @returns JSX.Element
 */
function GradientColorText({
  gradientColor = "bg-linear-to-r from-blue-500 to-teal-400",
  className,
  ...props
}: React.ComponentProps<"div"> & { gradientColor?: string }) {
  return (
    <div
      className={cn(
        "inline-block",
        "bg-clip-text text-transparent animate-fade-in",
        gradientColor,
        className
      )}
      {...props}
    />
  );
}

export { GradientColorText };
