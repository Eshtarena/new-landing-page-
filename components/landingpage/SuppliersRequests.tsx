import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function SuppliersRequests() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const isRTL = i18n.language === "ar";

  const handleClick = () => {
    router.push("/join-suppliers");
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className="w-64 h-64 rounded-full border-2 border-[#340040] text-[#340040] font-semibold text-lg transition-all duration-300 hover:bg-[#340040] hover:text-white flex items-center justify-center text-center px-6"
          >
            {t("suppliers.join_button")}
          </button>
        </div>
      </div>
    </section>
  );
} 