import Link from "next/link";
import { seller } from "@/data/seller";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-company">
          <strong>Газоанализатор.рус</strong>
          <span>{seller.legalName} · ИНН {seller.taxId}</span>
          <Link href="/contacts">Контакты и условия заказа</Link>
        </div>
        <div className="footer-contacts" aria-label="Контакты">
          <a href="tel:+79255086258">+7 (925) 508-62-58</a>
          <a href="tel:+74957486258">+7 (495) 748-62-58</a>
          <a href="mailto:info@prscom.ru">info@prscom.ru</a>
        </div>
      </div>
    </footer>
  );
}
