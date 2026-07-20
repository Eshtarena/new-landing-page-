import Image from "next/image";
import type { AdviceArticle } from "../../types/advice";

interface AdviceCardProps {
  article: AdviceArticle;
  isArabic: boolean;
  categoryLabel: string;
  readTimeLabel: string;
  cardTitle?: string;
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z" />
    </svg>
  );
}

function AdvisorAvatar({
  avatarUrl,
  name,
}: {
  avatarUrl?: string;
  name: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-11 h-11 rounded-full overflow-hidden bg-white/20 shrink-0 flex items-center justify-center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={44}
          height={44}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-white">{initials}</span>
      )}
    </div>
  );
}

export default function AdviceCard({
  article,
  isArabic,
  cardTitle = "Purchasing expert advice",
}: AdviceCardProps) {
  const adviceText = isArabic ? article.excerpt_ar : article.excerpt_en;
  const author = isArabic ? article.author_ar : article.author_en;
  const advisorTitle = isArabic
    ? article.advisorTitle_ar
    : article.advisorTitle_en;
  const productImage = article.productImageUrl || article.imageUrl;
  const likesCount = article.likesCount ?? 0;
  const sharesCount = article.sharesCount ?? 0;

  return (
    <article
      className="bg-primary-500 rounded-3xl shadow-soft-lg overflow-hidden p-5 sm:p-6 text-white transition-transform duration-300 ease-spring hover:-translate-y-0.5"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <p className="text-sm font-medium text-white/90 mb-4">{cardTitle}</p>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <AdvisorAvatar avatarUrl={article.advisorAvatarUrl} name={author || "?"} />
          <div className="min-w-0">
            <h2 className="text-base font-bold truncate">{author || "—"}</h2>
            {advisorTitle && (
              <p className="text-xs text-white/60 truncate">{advisorTitle}</p>
            )}
          </div>
        </div>

        {productImage && (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white shrink-0">
            <Image
              src={productImage}
              alt=""
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <p className="text-sm text-white/90 leading-relaxed mb-5 line-clamp-2">
        {adviceText}
      </p>

      <footer className="flex items-center gap-5 text-sm text-white/80">
        <span className="inline-flex items-center gap-1.5">
          <HeartIcon />
          {likesCount}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShareIcon />
          {sharesCount}
        </span>
      </footer>
    </article>
  );
}
