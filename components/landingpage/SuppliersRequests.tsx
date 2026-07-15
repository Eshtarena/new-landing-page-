import { useTranslation } from "next-i18next/pages";
import { useRouter } from "next/router";

export default function SuppliersRequests() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const isRTL = i18n.language === "ar";

  const handleClick = () => {
    router.push("/join-suppliers");
  };

  return (
    <section className={`bg-white py-12 sm:py-16 md:py-24 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-2 border-[#340040] text-[#340040] font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-[#340040] hover:text-white flex items-center justify-center text-center px-4 sm:px-6"
          >
            {t("suppliers.join_button")}
          </button>
        </div>
      </div>
    </section>
  );
} 