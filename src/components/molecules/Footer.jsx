import Link from "../atoms/Link";

import Logo from "../../assets/images/logo.svg";

export default function Footer() {
  return (
    <div className="text-center lg:text-left bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      <div className="xl:container mx-auto px-4 py-10 flex">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
          <div className="col-span-2 md:col-auto">
            <h6 className="mb-4 space-x-2 flex items-center justify-center md:justify-start">
              <img className="h-4 w-auto" src={Logo} alt="Logo" />
              <div className="uppercase font-semibold">TaskCare</div>
            </h6>
            <p className="text-sm text-left brightness-75">
              TaskCare is an interactive collaboration platform for organizing
              tasks in teams. From creating and assigning to monitoring,
              TaskCare offers everything for collaborative and, above all,
              structured work on projects. Try it!
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h6 className="uppercase font-semibold">Getting Started</h6>
            <div>
              <Link className="text-sm" to="/">
                Home
              </Link>
            </div>
            <div>
              <Link className="text-sm" to="/login">
                Login
              </Link>
            </div>
            <div>
              <Link className="text-sm" to="/register">
                Register
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h6 className="uppercase font-semibold">Support</h6>
            <div>
              <Link className="text-sm" to="/contact-us">
                Contact Us
              </Link>
            </div>
            <div>
              <Link className="text-sm" to="/faq">
                FAQ
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h6 className="uppercase font-semibold">Our Company</h6>
            <div>
              <Link className="text-sm" to="/about-us">
                About Us
              </Link>
            </div>
            <div>
              <Link className="text-sm" to="/terms-of-use">
                Terms of Use
              </Link>
            </div>
            <div>
              <Link className="text-sm" to="/privacy-policy">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center p-6 bg-gray-200 dark:bg-gray-900">
        <span>© 2022</span>
        &nbsp;
        <a
          className="font-semibold hover:brightness-110 hover:underline"
          href="https://github.com/0x1c1b"
        >
          0x1C1B
        </a>
      </div>
    </div>
  );
}
