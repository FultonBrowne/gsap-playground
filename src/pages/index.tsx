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
  const mouseRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !pageRef.current) return;

    gsap.set(pageRef.current, { opacity: 0, xPercent: -100 });
    gsap.set(blocksRef.current, { opacity: 0 });

    ScrollTrigger.create({
      trigger: textRef.current,
      start: "bottom center",
      end: "bottom top",
      onEnter: () => {
        gsap.to(pageRef.current, { opacity: 1, xPercent: 0, duration: 1 });
        gsap.to(textRef.current, { opacity: 0, duration: 1 });
        gsap.to(blocksRef.current, { opacity: 1, duration: 2 });

        blocksRef.current.forEach((block) => {
          gsap.to(block, {
            rotation: 360,
            duration: 20, // Longer duration for smoother rotation
            ease: "linear",
            repeat: -1,
          });

          gsap.to(block, {
            x: () => `${Math.random() * 100 - 50}vw`,
            y: () => `${Math.random() * 100 - 50}vh`,
            duration: () => Math.random() * 15 + 10, // Longer duration for smoother movement
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut", // Smoother easing function
          });
        });
      },
      onLeaveBack: () => {
        gsap.to(pageRef.current, { opacity: 0, xPercent: -100, duration: 1 });
        gsap.to(textRef.current, { opacity: 1, duration: 1 });
        gsap.set(blocksRef.current, { opacity: 0, duration: 2 });

        blocksRef.current.forEach((block) => {
          gsap.to(block, { rotation: 0, duration: 1 });
        });
      },
      markers: true,
    });

    // Mouse follow
    window.addEventListener("mousemove", (event) => {
      gsap.to(mouseRef.current, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.1,
      });
    });

    return () => {
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  return (
    <main className={lora.className}>
      <div className="fixed blur-xl top-0 left-0 w-full h-full z-[-1] ">
        {/* one cube the follows the mouse */}
        <div
          className="fixed w-[80px] h-[80px] bg-red-200 rounded-full"
          style={{
            top: `-40px`,
            left: `-40px`,
          }}
          ref={mouseRef}
        />
        {Array.from({ length: 35 }).map((_, index) => (
          <div
            key={index}
            ref={(el) => (blocksRef.current[index] = el)}
            className="fixed w-20 h-20 bg-red-200 rounded-xl"
            style={{
              top: `80%`,
              left: `20%`,
            }}
          />
        ))}
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <div ref={textRef} className="italic fixed">
          {"Hello There".split("").map((char, index) => (
            <span key={index} className="letter font-bold inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
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
