import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

const StepwiseScrollCards = () => {
    const navigate = useNavigate();

    const handleClick = (name) => {
        if (name === 'getPlayers') {
            navigate('/players');
        }
        else if (name === 'getComm') {
            navigate('/community');
        }
        else if(name === 'getCoach') {
            navigate('/coach');
        }
    }
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y1 = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);
    const y3 = useTransform(scrollYProgress, [0.4, 0.7], [50, 0]);

    const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 1, 1]);
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.5, 0.7], [0, 1, 1]);
    const opacity3 = useTransform(scrollYProgress, [0.4, 0.7, 0.9], [0, 1, 1]);

    return (
        <div ref={ref} className="flex flex-col w-[calc(100vw-15px)] justify-center items-center min-h-screen space-y-4">
            <motion.div
                className="w-full h-fit bg-[rgba(0,0,0,0.1)] text-white flex items-center justify-center shadow-lg p-2"
                style={{ y: y1, opacity: opacity1 }}
            >
                <div className='flex flex-col gap-2 justify-center items-start py-2 px-2'>
                    <div className='w-full'>
                        <img src="https://img.freepik.com/premium-photo/group-basketball-players-sit-bench-with-one-wearing-number-11-jersey_1204896-130753.jpg" alt="playersimg" className='w-full h-auto rounded-[10px] cursor-pointer hover:shadow-2xl' />
                    </div>
                    <p className='text-[20px]  font-roboto text-gray-200'>Meet the Champions - Discover and connect with passionate athletes</p>
                    <button onClick={() => handleClick('getPlayers')} className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl  cursor-pointer w-50'>Find Your Squad</button>
                </div>
            </motion.div>
            <motion.div
                className="w-full h-fit bg-[rgba(0,0,0,0.1)] text-white flex items-center justify-center shadow-lg p-2"
                style={{ y: y2, opacity: opacity2 }}
            >
                <div className='flex flex-col gap-2 justify-center items-start py-2 px-2'>
                    <div className='w-full'>
                        <img src="https://img.freepik.com/free-photo/friends-drinking-tailgate-party_53876-132075.jpg" alt="playersimg" className='w-full h-auto rounded-[10px] cursor-pointer hover:shadow-2xl' />
                    </div>
                    <p className='text-[20px]  font-roboto text-gray-200'>Beyond the Game - A thriving community for athletes and fans.</p>
                    <button onClick={() => handleClick('getComm')} className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl md:text-2xl cursor-pointer w-50'>Let's Talk Sports</button>
                </div>
            </motion.div>
            <motion.div
                className="w-full h-fit bg-[rgba(0,0,0,0.1)] text-white flex items-center justify-center shadow-lg p-2"
                style={{ y: y3, opacity: opacity3 }}
            >
                <div className='flex flex-col gap-2 justify-center items-start py-2 px-2'>
                    <div className='w-full'>
                        <img src="https://www.rootsofaction.com/wp-content/uploads/2018/01/Youth-Sports-Coach.jpg" alt="playersimg" className='w-full h-auto rounded-[10px] cursor-pointer hover:shadow-2xl' />
                    </div>
                    <p className='text-[20px]  font-roboto text-gray-200'>Coaching That Elevates - Get guidance from experienced mentors.</p>
                    <button onClick={() => handleClick('getCoach')} className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl md:text-2xl cursor-pointer w-50'>Get Coached</button>
                </div>
            </motion.div>
        </div>
    );
};

export default StepwiseScrollCards;
