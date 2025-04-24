import React, { forwardRef } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

const InteractiveHoverButton = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`group text-[20px] relative w-auto cursor-pointer overflow-hidden rounded-[10px] bg-primary px-5 py-[1px] text-center hover:border-2 ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-indigo-300 transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <AiOutlineArrowRight />
      </div>
    </button>
  );
});

export default InteractiveHoverButton;
