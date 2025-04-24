"use client";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedTestimonials = ({autoplay = false }) => {
    const testimonials = [
        {
            quote:
                "Being part of this community has been a game-changer for me. The resources, connections, and support have been invaluable.",
            name: "Ava Mitchell",
            designation: "Captain at Greenfield Badminton Club",
            src: "/assets/images/testinomial2.jpg",
        },
        {
            quote:
                "The platform has brought together athletes from all over. It's great to exchange tips and motivate each other to improve.",
            name: "Jordan Lee",
            designation: "Professional Basketball Player",
            src: "/assets/images/testinomial3.jpg",
        },
        {
            quote:
                "The support and knowledge shared by fellow members has pushed me to reach new heights in my training and performance.",
            name: "Chris Walker",
            designation: "Captain at City Runners Club",
            src: "/assets/images/testinomial1.jpg",
        },
        {
            quote:
                "Joining this community has opened new doors for networking and training. It's an essential part of our team's growth.",
            name: "Olivia Davis",
            designation: "Track & Field Coach",
            src: "/assets/images/testinomial4.jpg",
        },
        {
            quote:
                "The variety of sports and expertise available here is exceptional. It’s a one-stop community for anyone passionate about sports.",
            name: "Ethan Carter",
            designation: "Sports Enthusiast & Fitness Blogger",
            src: "/assets/images/testinomial5.jpg",
        },
    ];
    
    const [active, setActive] = useState(0);
    const handleNext = () => {
        setActive((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const isActive = (index) => index === active;

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoplay, testimonials.length]);

    const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

    return (
        <div className="z-10 max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-10 lg:px-12 py-20">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
                <div>
                    <div className="relative h-80 w-full">
                        <AnimatePresence>
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: -100,
                                        rotate: randomRotateY(),
                                    }}
                                    animate={{
                                        opacity: isActive(index) ? 1 : 0.7,
                                        scale: isActive(index) ? 1 : 0.95,
                                        z: isActive(index) ? 0 : -100,
                                        rotate: isActive(index) ? 0 : randomRotateY(),
                                        zIndex: isActive(index) ? 999 : testimonials.length + 2 - index,
                                        y: isActive(index) ? [0, -80, 0] : 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: 100,
                                        rotate: randomRotateY(),
                                    }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="absolute inset-0 origin-bottom"
                                >
                                    <img
                                        src={testimonial.src}
                                        alt={testimonial.name}
                                        width={500}
                                        height={500}
                                        draggable={false}
                                        className="h-full w-full rounded-3xl object-cover object-center"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex justify-between flex-col py-4">
                    <motion.div
                        key={active}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <h3 className="text-[35px] font-bold font-roboto text-gray-900 dark:text-white">{testimonials[active].name}</h3>
                        <p className="font-roboto text-base text-gray-900 dark:text-neutral-500">{testimonials[active].designation}</p>
                        <motion.p className="text-[18px] text-gray-300 mt-8 dark:text-neutral-300">
                            {testimonials[active].quote.split(" ").map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * index }}
                                    className="inline-block"
                                >
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                        </motion.p>
                    </motion.div>
                    <div className="flex gap-4 pt-12 md:pt-2">
                        <button
                            onClick={handlePrev}
                            className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
                        >
                            <FaArrowLeft className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:rotate-12 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
                        >
                            <FaArrowRight className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:-rotate-12 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};