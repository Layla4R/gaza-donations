"use client";
import Icon from "@/components/icons";
import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
export default function LocaleError({ error, reset, }: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}) {
    const params = useParams();
    const locale = typeof params.locale === "string" ? params.locale : "en";
    const copy = ({
        ar: ["حدث خطأ", "حدث خطأ. يرجى المحاولة مجددًا.", "حاول مجددًا", "العودة للرئيسية"],
        en: ["An error occurred", "Something went wrong. Please try again.", "Try Again", "Go Home"],
        fr: ["Une erreur s’est produite", "Un problème est survenu. Réessayez.", "Réessayer", "Accueil"],
        tr: ["Bir hata oluştu", "Bir sorun oluştu. Lütfen tekrar deneyin.", "Tekrar dene", "Ana sayfa"],
    } as Record<string, string[]>)[locale] || ["An error occurred", "Please try again.", "Try Again", "Go Home"];
    useEffect(() => {
        if (process.env.NODE_ENV !== "production")
            console.error(error);
    }, [error]);
    return (<div className="min-h-[60vh] flex items-center justify-center px-6 py-16 bg-section-gradient">
      <div className="bg-white rounded-2xl border border-line shadow-xl p-10 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-5">
          <Icon name="x" size={28} className="text-danger"/>
        </div>
        <h1 className="font-display text-2xl font-extrabold text-ink mb-3">{copy[0]}</h1>
        <p className="text-muted mb-6 text-sm">{copy[1]}</p>
        <div className="space-y-3">
          <button onClick={reset} className="block w-full bg-brand text-white font-bold rounded-xl px-6 py-3 hover:bg-brand-dark transition">
            {copy[2]}
          </button>
          <Link href={`/${locale}`} className="block w-full border border-line text-muted font-bold rounded-xl px-6 py-3 hover:border-brand hover:text-brand transition">
            {copy[3]}
          </Link>
        </div>
      </div>
    </div>);
}
