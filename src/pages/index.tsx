import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { Inter } from "next/font/google";

const lora = Inter({
  subsets: ["latin"],
  weight: "700",
});

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const textRef = useRef(null);
  const pageRef = useRef(null);
  const blocksRef = useRef([]);

  useEffect(() => {
    if (!textRef.current || !pageRef.current) return;

    gsap.set(pageRef.current, { opacity: 0, xPercent: -100 });
    gsap.set(blocksRef.current, { opacity: 0 });

    ScrollTrigger.create({
      trigger: textRef.current,
      start: "bottom center",
      end: "bottom top",
      onEnter: () => {
        // Snap to the next page
        gsap.to(pageRef.current, { opacity: 1, xPercent: 0, duration: 1 });
        gsap.to(textRef.current, { opacity: 0, duration: 1 });
        // show the blocks
        gsap.to(blocksRef.current, { opacity: 1, duration: 2 });
        // Animate the blocks
        const tl = gsap.timeline({ repeat: -1 });

        blocksRef.current.forEach((block, index) => {
          tl.to(block, {
            rotation: 720,
            duration: 1,
            ease: "linear",
            onComplete: () => {
              gsap.set(block, { rotation: 0 }); // Reset rotation after each spin
            },
          });
          tl.to(block, { rotation: 0, duration: 0.5 }); // Pause between spins
        });

        // Subtle movement and grow effect
        blocksRef.current.forEach((block) => {
          gsap.to(block, {
            x: () => `${Math.random() * 10 - 5}px`,
            y: () => `${Math.random() * 10 - 5}px`,
            scale: () => 1 + Math.random() * 0.2,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      },
      onLeaveBack: () => {
        gsap.to(pageRef.current, { opacity: 0, xPercent: -100, duration: 1 });
        gsap.to(textRef.current, { opacity: 1, duration: 1 });
        gsap.set(blocksRef.current, { opacity: 0, duration: 2 });

        // Reset blocks animation
        blocksRef.current.forEach((block) => {
          gsap.to(block, { rotation: 0, duration: 1 });
        });
      },
      markers: true,
    });
  }, []);

  return (
    <main className={lora.className}>
      <div className="flex min-h-screen items-center justify-center">
        <div ref={textRef} className="italic fixed">
          {"Hello There".split("").map((char, index) => (
            <span key={index} className="letter font-bold inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
      <div className="fixed top-0 left-0 w-[1/2] h-1/2 z-[-1] ">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            ref={(el) => (blocksRef.current[index] = el)}
            className="fixed w-10 h-10 bg-zinc-200 rounded-xl"
            style={{
              top: `${Math.random() * 70}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      <div
        ref={pageRef}
        className="flex flex-col justify-end p-24 pt-0 relative snap-start"
      >
        <div className="text-5xl">I'm Fulton Browne</div>
        <div className="flex gap-2 font-normal">
          <div>software engineer</div>
          <div>photographer</div>
          <div>hiker</div>
        </div>
      </div>
    </main>
  );
}
