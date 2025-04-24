import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const data = [
    {
      title: "About",
      links: ["Features", "Pricing", "Support", "Forums"],
    },
    {
      title: "Project",
      links: ["Contribute", "Media assets", "Changelog", "Releases"],
    },
    {
      title: "Community",
      links: ["Join Discord", "Follow on Twitter", "Email newsletter", "GitHub discussions"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 font-roboto mt-2 sm:mt-0">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-white text-2xl font-bold">KhelMilaap</h2>
          <p className="text-sm opacity-75 mt-2">
            Build fully functional, accessible sports communities faster than ever.
          </p>
        </div>

        {/* Links Section */}
        {data.map((group, index) => (
          <div key={index} className="hidden lg:block ml-15">
            <h3 className="text-white text-lg font-semibold mb-3">{group.title}</h3>
            <ul className="space-y-2">
              {group.links.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-blue-500 transition duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between px-6 max-w-7xl mx-auto">
        <p className="text-sm opacity-75">© {new Date().getFullYear()} KhelMilaap. All rights reserved.</p>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaYoutube size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
