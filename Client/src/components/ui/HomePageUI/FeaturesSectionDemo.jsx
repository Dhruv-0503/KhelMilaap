// src/components/FeaturesSectionDemo.jsx
import { FaBolt, FaCloud, FaDollarSign, FaRegHeart, FaQuestionCircle, FaRoute, FaTerminal } from 'react-icons/fa';

export function FeaturesSectionDemo() {
    const features = [
        {
            title: "Built for Players",
            description: "A platform tailored to athletes, helping them connect, train, and grow together.",
            icon: <FaTerminal />,
        },
        {
            title: "Ease of Use",
            description: "A user-friendly experience designed for players and coaches alike, no tech expertise needed.",
            icon: <FaRegHeart />,
        },
        {
            title: "Coach Collaboration",
            description: "Facilitate coaching sessions, share training material, and build winning strategies together.",
            icon: <FaBolt />,
        },
        {
            title: "Event Management",
            description: "Create and manage sports events with ease, from local tournaments to international competitions.",
            icon: <FaCloud />,
        },
        {
            title: "Community Engagement",
            description: "A space to interact, share experiences, and build a strong, supportive sports community.",
            icon: <FaRegHeart />,
        },
        {
            title: "Multi-Tenant Arc.",
            description: "Support for multiple teams, ensuring a seamless experience for every user.",
            icon: <FaRoute />,
        },
        {
            title: "24/7 Support",
            description: "Our AI agents and support team are always available to help you out, anytime, anywhere.",
            icon: <FaQuestionCircle />,
        },
        {
            title: "Affordable Pricing",
            description: "Flexible pricing options for all levels of players and teams—no hidden fees or commitments.",
            icon: <FaDollarSign />,
        }
    ];

    return (
        <div className="relative z-10 max-w-8xl lg:mx-3">
            <div className="absolute inset-0 bg-[url('/assets/images/FeatureBG.jpg')] bg-cover bg-center opacity-20"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
                {features.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index} />
                ))}
            </div>
        </div>
    );
}

const Feature = ({ title, description, icon, index }) => {
    return (
        <div
            className={`flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800 ${index === 0 || index === 4 ? " lg:border-l dark:border-neutral-800" : ""
                } ${index < 4 ? "lg:border-b dark:border-neutral-800" : ""}
                ${index === 1 || index === 3 || index === 5 || index === 7 ? "md:border-b md:border-l" : "md:border-b"}
                `}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-gray-300 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-gray-300 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div className="group-hover/feature:text-blue-900 mb-4 relative z-10 px-10 text-gray-300 opacity-80 text-2xl dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-2xl text-gray-900 font-bold font-roboto bg-transparent mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-7 group-hover/feature:h-9 w-1 rounded-tr-full rounded-br-full opacity-80 bg-gray-300 dark:bg-neutral-700 group-hover/feature:bg-blue-700 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p
                className=" group-hover/feature:translate-x-2 text-[15px] font-roboto text-gray-300 opacity-90 dark:text-neutral-300 max-w-xs relative z-10 px-10 
            group-hover/feature:text-gray-900 group-hover/feature:dark:text-neutral-100
            group-hover/feature:opacity-100 transition duration-200"
            >
                {description}
            </p>
        </div>
    );
};