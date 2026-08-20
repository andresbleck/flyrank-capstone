import { ShutterText } from "./shutter-text";

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-photo.avif)" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <h1
          aria-label="FORGE"
          className="forge-title-glow font-[family-name:var(--font-changa-one)] text-7xl leading-none tracking-tight text-orange-500 uppercase sm:text-9xl md:text-[11rem] lg:text-[14rem]"
        >
          <ShutterText text="FORGE" />
        </h1>
        <p className="max-w-xl text-base font-bold  text-gray-100 [text-shadow:_0_2px_6px_rgb(0_0_0_/_70%)] sm:text-lg md:text-xl">
          Train with a goal. We&apos;ll help you reach it.
        </p>
        <a
          href="#plans"
          className="cursor-pointer rounded-md bg-orange-600 px-8 py-3 font-[family-name:var(--font-baloo-2)] text-base font-semibold text-white transition-colors hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-lg"
        >
          Start training
        </a>
      </div>
    </section>
  );
}
