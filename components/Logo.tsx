import Link from "next/link";
import Image from "next/image";
import { dictionary as t } from "@/dictionaries/en";

export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <Image
        src="/orenew-detailed.svg"
        alt={t.brand.name}
        width={28}
        height={28}
        className="h-7 w-7 transition-transform group-hover:scale-105"
        priority
      />
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight text-white">
          {t.brand.name}
        </span>
      )}
    </Link>
  );
}
