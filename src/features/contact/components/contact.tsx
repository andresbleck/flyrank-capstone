import type { ReactNode, SVGProps } from "react";

import { ContactForm } from "@/features/contact/components/contact-form";
import { Faq } from "@/features/contact/components/faq";

const generalContact = {
  phone: "+54 381 400 1000",
  phoneHref: "tel:+543814001000",
  instagramHandle: "@forge.gym",
  instagramUrl: "https://instagram.com/forge.gym",
};

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2 2C10.5 19.5 4.5 13.5 4.5 6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 12h16M14 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Location = {
  id: string;
  name: string;
  street: string;
  streetNumber: string;
  phone: string;
  phoneHref: string;
  mapQuery: string;
};

const locations: Location[] = [
  {
    id: "centro",
    name: "Tucumán Centro",
    street: "Córdoba",
    streetNumber: "742",
    phone: "+54 381 421 5590",
    phoneHref: "tel:+543814215590",
    mapQuery: "Córdoba 742, San Miguel de Tucumán, Argentina",
  },
  {
    id: "norte",
    name: "Tucumán Norte",
    street: "Corrientes",
    streetNumber: "1350",
    phone: "+54 381 452 7788",
    phoneHref: "tel:+543814527788",
    mapQuery: "Corrientes 1350, San Miguel de Tucumán, Argentina",
  },
  {
    id: "sur",
    name: "Tucumán Sur",
    street: "Av. Roca",
    streetNumber: "3820",
    phone: "+54 381 480 6612",
    phoneHref: "tel:+543814806612",
    mapQuery: "Av. Roca 3820, San Miguel de Tucumán, Argentina",
  },
];

type ContactChannel = {
  id: string;
  icon: ReactNode;
  label: string;
  value: string;
  helperText: string;
  href?: string;
  ariaLabel?: string;
};

const contactChannels: ContactChannel[] = [
  {
    id: "phone",
    icon: <PhoneIcon className="h-5 w-5" />,
    label: "Phone",
    value: generalContact.phone,
    helperText: "Mon to Fri · 10am to 7pm",
    href: generalContact.phoneHref,
  },
  {
    id: "instagram",
    icon: <InstagramIcon className="h-5 w-5" />,
    label: "Instagram",
    value: generalContact.instagramHandle,
    helperText: "Photos, stories & updates",
    href: generalContact.instagramUrl,
    ariaLabel: "Follow FORGE on Instagram",
  },
  {
    id: "hours",
    icon: <ClockIcon className="h-5 w-5" />,
    label: "Hours",
    value: "6am – 10pm",
    helperText: "Monday to Saturday",
  },
  {
    id: "location",
    icon: <PinIcon className="h-5 w-5" />,
    label: "Gym",
    value: "Tucumán, Argentina",
    helperText: "Tours by appointment on Saturdays",
  },
];

const iconCircleClasses =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-500";

const channelRowClasses =
  "group flex items-center gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-6";

function ContactChannelRow({ channel }: { channel: ContactChannel }) {
  const content = (
    <>
      <span aria-hidden="true" className={iconCircleClasses}>
        {channel.icon}
      </span>
      <div className="flex-1">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          {channel.label}
        </p>
        <p className="font-[family-name:var(--font-baloo-2)] text-lg font-bold text-white">
          {channel.value}
        </p>
        <p className="text-xs text-gray-500">{channel.helperText}</p>
      </div>
      {channel.href && (
        <ArrowIcon className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-orange-500" />
      )}
    </>
  );

  if (channel.href) {
    return (
      <a
        href={channel.href}
        aria-label={channel.ariaLabel}
        className={`${channelRowClasses} transition-colors duration-300 ease-out hover:border-orange-500/40`}
      >
        {content}
      </a>
    );
  }

  return <div className={channelRowClasses}>{content}</div>;
}

export function Contact() {
  return (
    <>
      <section className="bg-neutral-950 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-[family-name:var(--font-changa-one)] text-4xl tracking-tight text-orange-500 uppercase sm:text-5xl">
            Contact
          </h1>
          <p className="mt-4 text-base text-gray-300 sm:text-lg">
            Reach out or stop by the gym — we&apos;re happy to help.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="flex h-full flex-col justify-between gap-6">
            {contactChannels.map((channel) => (
              <ContactChannelRow key={channel.id} channel={channel} />
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span aria-hidden="true" className={iconCircleClasses}>
                <MailIcon className="h-5 w-5" />
              </span>
              <h2 className="font-[family-name:var(--font-baloo-2)] text-2xl font-bold text-white">
                Or send us a message
              </h2>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-neutral-800 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-changa-one)] text-4xl tracking-tight text-orange-500 uppercase sm:text-5xl">
            Locations
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <article
              key={location.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/25 bg-neutral-900 transition-colors duration-300 ease-out hover:border-orange-500/40"
            >
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className={iconCircleClasses}>
                    <PinIcon className="h-5 w-5" />
                  </span>
                  <p className="font-[family-name:var(--font-baloo-2)] font-bold text-white">
                    {location.name}
                  </p>
                </div>

                <p className="text-sm text-gray-300">
                  {location.street} {location.streetNumber}
                </p>

                <a
                  href={location.phoneHref}
                  className="text-sm text-gray-400 transition-colors duration-300 ease-out hover:text-orange-500"
                >
                  {location.phone}
                </a>
              </div>

              <div className="h-40 w-full border-t border-white/10 [filter:invert(92%)_hue-rotate(180deg)_contrast(0.9)_brightness(0.95)]">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`}
                  title={`Map showing ${location.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <Faq />
    </>
  );
}
