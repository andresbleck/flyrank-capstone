type AvatarProps = {
  initials: string;
  variant: "user" | "assistant";
};

export function Avatar({ initials, variant }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
        variant === "user"
          ? "bg-blue-600 text-white"
          : "bg-white/20 text-white"
      }`}
    >
      {initials}
    </span>
  );
}
