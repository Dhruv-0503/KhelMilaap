import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const products = [
  {
    title: "Football Facer",
    link: "/community",
    thumbnail: "/assets/images/c1.jpg",
  },
  {
    title: "Cricket Champs",
    link: "/community",
    thumbnail: "/assets/images/c3.jpeg",
  },
  {
    title: "Tennis Stars",
    link: "/community",
    thumbnail: "/assets/images/c2.jpg",
  },
  {
    title: "Hockey Rocky",
    link: "/community",
    thumbnail: "/assets/images/c4.jpg",
  },
  {
    title: "Badminton Star",
    link: "/community",
    thumbnail: "/assets/images/c2.jpg",
  },
  {
    title: "Football Goal",
    link: "/community",
    thumbnail: "/assets/images/c1.jpg",
  },
  {
    title: "Gully Cricket MPL",
    link: "/events",
    thumbnail: "/assets/images/EventCricket.jpg",
  },
  {
    title: "Football Star1",
    link: "/events",
    thumbnail: "/assets/images/EventFootball.webp",
  },
  {
    title: "Tennis Season 5",
    link: "/events",
    thumbnail: "/assets/images/EventTennis.jpg",
  },
  {
    title: "Hockey Hustle",
    link: "/events",
    thumbnail: "/assets/images/EventHockey.avif",
  },
  {
    title: "Badminton NAX2",
    link: "/events",
    thumbnail: "/assets/images/EventBadminton.webp",
  },
  {
    title: "MPL Season 8",
    link: "/events",
    thumbnail: "/assets/images/EventCricket.jpg",
  },
  {
    title: "Tennis Event",
    link: "/events",
    thumbnail: "/assets/images/EventTennis.jpg",
  },
  {
    title: "Hockey Event",
    link: "/events",
    thumbnail: "/assets/images/EventHockey.avif",
  },
  {
    title: "Badminton Event",
    link: "/events",
    thumbnail: "/assets/images/EventBadminton.webp",
  },
];

export const HeroParallax = () => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div
      ref={ref}
      className="mb-2 h-[245vh] py-10 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] lg:w-[calc(100vw-17px)]"
    >
      <Header />
      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="mt-[-200px]"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl py-2 px-5">
      <h1 className="text-[26px] md:text-5xl lg:text-7xl font-bold font-roboto">The Ultimate Community for Sports Enthusiasts</h1>
      <p className="max-w-2xl md:text-xl mt-2 text-gray-100 font-roboto">
      We connect passionate sports enthusiasts through the latest technologies and platforms. Our team is dedicated to creating seamless experiences that bring the sports community closer, making every game more engaging and accessible.
      </p>
    </div>
  );
};

export const ProductCard = ({ product, translate }) => (
  <motion.div
    style={{ x: translate }}
    whileHover={{ y: -20 }}
    key={product.title}
    className="group/product h-96 w-[30rem] relative flex-shrink-0 border-1 shadow-2xl"
  >
    <a href={product.link} className="block group-hover/product:shadow-2xl">
      <img
        src={product.thumbnail}
        height="600"
        width="600"
        className="object-cover object-left-top absolute h-full w-full inset-0"
        alt={product.title}
      />
    </a>
    <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
    <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
      {product.title}
    </h2>
  </motion.div>
);
