import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[hsl(224.3,76.3%,48%)] text-[hsl(210,0%,100%)] hover:bg-[hsl(224.3,76.3%,40%)]",
        destructive:
          "bg-[hsl(0,84.2%,60.2%)] text-[hsl(210,40%,98%)] hover:bg-[hsl(0,84.2%,50%)]",
        outline:
          "border border-[hsl(240,3.7%,15.9%)] bg-gray-200 hover:bg-gray-300 hover:text-black",
        secondary:
          "bg-[hsl(217.2,32.6%,17.5%)] text-[hsl(210,40%,98%)] hover:bg-[hsl(217.2,32.6%,25%)]",
        ghost: "hover:bg-[hsl(240,3.7%,15.9%)] hover:text-[hsl(240,4.8%,95.9%)]",
        link: "text-[hsl(224.3,76.3%,48%)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
