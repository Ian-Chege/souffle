"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { catalogueNumber, fmtPrice } from "@/lib/utils";

export interface LampCardData {
  slug: string;
  name: string;
  designer: string;
  country: string;
  year: number;
  price: number;
  sold: boolean;
  imageUrl: string | null;
}

export default function LampCard({
  lamp,
  priority = false,
}: {
  lamp: LampCardData;
  priority?: boolean;
}) {
  const router = useRouter();
  const num = catalogueNumber(lamp.slug);

  return (
    <article
      className="specimen"
      tabIndex={0}
      role="link"
      aria-label={`${lamp.name} — ${num}`}
      onClick={() => router.push(`/archive/${lamp.slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/archive/${lamp.slug}`);
      }}
    >
      <div className="plate">
        {lamp.imageUrl && (
          <Image
            src={lamp.imageUrl}
            alt={lamp.name}
            fill
            sizes="(max-width: 520px) 100vw, (max-width: 820px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={priority}
          />
        )}
        {lamp.sold && <div className="tag">Sold</div>}
      </div>
      <div className="ledger">
        <span className="num">{num}</span>
        <span className="name">{lamp.name}</span>
        <span className={`price ${lamp.sold ? "sold" : ""}`}>
          {lamp.sold ? "— sold" : fmtPrice(lamp.price)}
        </span>
        <span className="sub">
          {lamp.designer} · {lamp.country} · {lamp.year}
        </span>
      </div>
    </article>
  );
}
