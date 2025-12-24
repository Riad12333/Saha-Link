"use client"

import { useLanguage } from "@/providers/language-provider"
import { Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="w-full bg-card border-t border-border mt-20">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.about_title")}</h3>
            <p className="text-sm text-muted-foreground">{t("footer.about_desc")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.quick_links")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-muted-foreground hover:text-foreground transition">
                  {t("nav.doctors")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition">
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition">
                  {t("footer.disclaimer")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.contact_title")}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-muted-foreground">+213 1 23 45 67</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-muted-foreground">contact@sahalink.dz</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span className="text-muted-foreground">{t("footer.address")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 {t("footer.rights")}</p>
            <p>{t("footer.made_with")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
