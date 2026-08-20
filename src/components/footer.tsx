import Link from "next/link";
import type { SVGProps } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/ai-coach", label: "AI Coach" },
];

const membershipLinks = [
  { href: "/#plans", label: "Monthly" },
  { href: "/#plans", label: "Annual" },
  { href: "/#plans", label: "Pro" },
];

const locations = ["Tucumán Centro", "Tucumán Norte", "Tucumán Sur"];

const footerLinkClasses =
  "relative pb-1 text-sm text-gray-300 transition-colors duration-300 ease-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 after:ease-out hover:text-orange-500 hover:after:w-full";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14 8.5h2V5.5h-2c-1.93 0-3.5 1.57-3.5 3.5v2H8.5v3H10.5V19h3v-6h2l.5-3h-2.5v-2c0-.28.22-.5.5-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16 4c.3 1.9 1.6 3.3 3.5 3.6v2.7c-1.3 0-2.5-.4-3.5-1.1v6.3a5 5 0 1 1-5-5c.2 0 .3 0 .5.02v2.7a2.3 2.3 0 1 0 1.9 2.28V4h2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="font-[family-name:var(--font-changa-one)] text-xl tracking-tight text-orange-500 uppercase"
            >
              Forge
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Train with a goal. 
            </p>
            <p className="mt-3 text-sm text-gray-400">
              We&apos;ll help you reach it.
            </p>

          </div>

          <div>
            <h3 className="font-[family-name:var(--font-baloo-2)] text-sm font-bold text-white">
              Memberships
            </h3>
            <ul className="mt-3 flex flex-col gap-3">
              {membershipLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLinkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-baloo-2)] text-sm font-bold text-white">
              Navigate
            </h3>
            <nav aria-label="Footer" className="mt-3 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={footerLinkClasses}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-baloo-2)] text-sm font-bold text-white">
              Locations
            </h3>
            <ul className="mt-3 flex flex-col gap-3">
              {locations.map((location) => (
                <li key={location} className="text-sm text-gray-300">
                  {location}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-baloo-2)] text-sm font-bold text-white">
              Follow us
            </h3>
            <div className="mt-3 flex gap-4">
              <a
                href="#"
                aria-label="Follow FORGE on Instagram"
                className="text-gray-300 transition-colors duration-300 ease-out hover:text-orange-500"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Follow FORGE on Facebook"
                className="text-gray-300 transition-colors duration-300 ease-out hover:text-orange-500"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Follow FORGE on TikTok"
                className="text-gray-300 transition-colors duration-300 ease-out hover:text-orange-500"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FORGE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
