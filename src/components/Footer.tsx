import LogoWhiteIcon from "../icons/LogoWhiteIcon";

const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 w-full h-30 bg-gray-400 text-white justify-center items-center">
      <LogoWhiteIcon className="h-5" />
      <p className="text-sm text-gray-300">© 2025. All rights reserved.</p>
    </footer>
  );
};
export default Footer;
