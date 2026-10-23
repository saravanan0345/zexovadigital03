import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Dir = "up" | "left" | "right";
const offset = { up: { y: 28 }, left: { x: -48 }, right: { x: 48 } };

export function Reveal({
  children,
  dir = "up",
  delay = 0,
  className,
  ...rest
}: { children: ReactNode; dir?: Dir; delay?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, ...offset[dir] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  center = true,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal dir="left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      </Reveal>
      <Reveal dir="left" delay={0.08}>
        <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">{title}</h2>
      </Reveal>
      {text && (
        <Reveal dir="right" delay={0.16}>
          <p className="mt-4 text-muted-foreground md:text-lg">{text}</p>
        </Reveal>
      )}
    </div>
  );
}
