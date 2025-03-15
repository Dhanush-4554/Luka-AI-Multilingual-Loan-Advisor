import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-2 w-full grow overflow-hidden rounded-full"
      style={{
        backgroundColor: "hsl(193, 100.00%, 84.70%)", 
        borderColor: "hsl(240, 3.7%, 15.9%)", 
      }}
    >
      <SliderPrimitive.Range
        className="absolute h-full"
        style={{
          backgroundColor: "hsl(215, 94.10%, 53.70%)",
        }}
        
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      style={{
        backgroundColor: "hsl(0, 0.00%, 100.00%)", 
        borderColor: "hsl(224.3, 76.3%, 48%)", 
        color: "hsl(240, 4.8%, 95.9%)", 
        outlineColor: "hsl(217.2, 91.2%, 59.8%)", 
      }}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
