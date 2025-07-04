import { forwardRef } from "react";
import * as Slot from "@rn-primitives/slot";
import { SlottableTextProps, TextRef } from "@rn-primitives/types";
import { Platform, Text as RNText, Role } from "react-native";
import { cn } from "@/lib/utils";

const H1 = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="1"
        className={cn(
          "text-4xl font-extrabold tracking-tight text-foreground web:select-text web:scroll-m-20 lg:text-5xl",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H1.displayName = "H1";

const H2 = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="2"
        className={cn(
          "border-b border-border pb-2 text-3xl font-semibold tracking-tight text-foreground first:mt-0 web:select-text web:scroll-m-20",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H2.displayName = "H2";

const H3 = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="3"
        className={cn(
          "text-2xl font-semibold tracking-tight text-foreground web:select-text web:scroll-m-20",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H3.displayName = "H3";

const H4 = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="4"
        className={cn(
          "text-xl font-semibold tracking-tight text-foreground web:select-text web:scroll-m-20",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H4.displayName = "H4";

const P = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn("text-base text-foreground web:select-text", className)}
        ref={ref}
        {...props}
      />
    );
  },
);
P.displayName = "P";

const BlockQuote = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role={Platform.OS === "web" ? ("blockquote" as Role) : undefined}
        className={cn(
          "native:mt-4 native:pl-3 mt-6 border-l-2 border-border pl-6 text-base italic text-foreground web:select-text",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

BlockQuote.displayName = "BlockQuote";

const Code = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role={Platform.OS === "web" ? ("code" as Role) : undefined}
        className={cn(
          "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] text-sm font-semibold text-foreground web:select-text",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Code.displayName = "Code";

const Lead = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
          "text-xl text-muted-foreground web:select-text",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Lead.displayName = "Lead";

const Large = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
          "text-xl font-semibold text-foreground web:select-text",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Large.displayName = "Large";

const Small = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
          "text-sm font-medium leading-none text-foreground web:select-text",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Small.displayName = "Small";

const Muted = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
          "text-sm text-muted-foreground web:select-text",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Muted.displayName = "Muted";

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small };
