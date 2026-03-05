import React from "react";

const SCHOOL_NAME = "UMURERWA SCHOOL";

const letterColors = [
  "text-letter-red",
  "text-letter-orange",
  "text-letter-yellow",
  "text-letter-green",
  "text-letter-teal",
  "text-letter-blue",
  "text-letter-indigo",
  "text-letter-purple",
  "text-letter-pink",
  "text-letter-rose",
  "text-letter-lime",
  "text-letter-cyan",
  "text-letter-amber",
  "text-letter-sky",
];

interface RainbowSchoolNameProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-5xl",
  lg: "text-4xl md:text-6xl lg:text-7xl",
  xl: "text-5xl md:text-7xl lg:text-8xl",
};

const RainbowSchoolName: React.FC<RainbowSchoolNameProps> = ({ size = "lg" }) => {
  let colorIndex = 0;

  return (
    <h1 className={`font-display ${sizeClasses[size]} tracking-wider select-none`}>
      {SCHOOL_NAME.split("").map((char, i) => {
        if (char === " ") {
          return <span key={i}>&nbsp;&nbsp;</span>;
        }
        const color = letterColors[colorIndex % letterColors.length];
        colorIndex++;
        return (
          <span
            key={i}
            className={`${color} inline-block hover:scale-125 transition-transform duration-200 cursor-default drop-shadow-md`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
};

export default RainbowSchoolName;
