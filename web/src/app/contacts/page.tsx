import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCheck, ChevronRight, ClipboardList, Mail, MessageSquareText, Phone, Send } from "lucide-react";
import { QuoteRequestButton } from "@/components/quote-request";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/data/categories";
import { seller } from "@/data/seller";
import { absoluteUrl, getSeoPageById } from "@/lib/seo/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import styles from "./contacts.module.css";

const contacts = {
  email: "info@prscom.ru",
  phones: [
    { label: "+7 (925) 508-62-58", href: "tel:+79255086258" },
    { label: "+7 (495) 748-62-58", href: "tel:+74957486258" },
  ],
};

type ContactsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: ContactsPageProps): Promise<Metadata> {
  const parameters = await searchParams;
  return buildPageMetadata("contacts", { index: Object.keys(parameters).length === 0 });
}

export default function ContactsPage() {
  const seoPage = getSeoPageById("contacts");
  const pageUrl = absoluteUrl(seoPage.canonical);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: "Газоанализатор.рус",
        legalName: seller.legalName,
        taxID: seller.taxId,
        url: pageUrl,
        email: contacts.email,
        telephone: contacts.phones.map((phone) => phone.label),
        areaServed: { "@type": "Country", name: "Россия" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: seoPage.h1, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <section className={styles.intro} aria-labelledby="contacts-title">
          <div className={styles.container}>
            <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
              <ol>
                <li><Link href="/">Главная</Link></li>
                <li>
                  <ChevronRight size={14} aria-hidden="true" />
                  <span aria-current="page">Контакты и условия заказа</span>
                </li>
              </ol>
            </nav>
            <h1 id="contacts-title">{seoPage.h1}</h1>
            <p className={styles.lead}>
              Подбор и заказ газоанализаторов и сенсоров. Обсудим задачу, уточним исполнение и подготовим предложение.
            </p>

            <div className={styles.contactGrid}>
              <address className={styles.contactList}>
                <div className={styles.contactRow}>
                  <Phone size={22} aria-hidden="true" />
                  <div>
                    <p className={styles.label}>Телефоны</p>
                    {contacts.phones.map((phone) => (
                      <a className={styles.contactLink} href={phone.href} key={phone.href}>{phone.label}</a>
                    ))}
                  </div>
                </div>
                <div className={styles.contactRow}>
                  <Mail size={22} aria-hidden="true" />
                  <div>
                    <p className={styles.label}>Электронная почта</p>
                    <a className={styles.contactLink} href={`mailto:${contacts.email}`}>{contacts.email}</a>
                  </div>
                </div>
              </address>

              <div className={styles.request}>
                <h2>Запрос коммерческого предложения</h2>
                <p>Укажите модель или задачу, контролируемый газ, диапазон измерений и количество приборов, если они уже известны.</p>
                <QuoteRequestButton
                  className={`button button-primary ${styles.quoteButton}`}
                  subject="Подбор и заказ газоанализаторов и сенсоров"
                  source="contacts"
                >
                  <Send size={18} aria-hidden="true" />
                  <span>Запросить КП</span>
                </QuoteRequestButton>
                <p className={styles.responseNote}>
                  <strong>{seller.responseNotice}.</strong>{" "}
                  Если для расчета понадобятся дополнительные параметры, уточним их с вами.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.order} id="order" aria-labelledby="order-title">
          <div className={styles.container}>
            <h2 id="order-title">Как согласуем заказ</h2>
            <ol className={styles.steps}>
              <li>
                <div className={styles.stepHeading}>
                  <MessageSquareText size={24} aria-hidden="true" />
                </div>
                <h3>Запрос</h3>
                <p>Получаем запрос на выбранную модель или подбор по задаче. Уточняем исходные данные и требования к оборудованию.</p>
              </li>
              <li>
                <div className={styles.stepHeading}>
                  <ClipboardList size={24} aria-hidden="true" />
                </div>
                <h3>Коммерческое предложение</h3>
                <p>Уточняем исполнение, комплектацию, стоимость и срок поставки. Условия предлагаем в КП.</p>
              </li>
              <li>
                <div className={styles.stepHeading}>
                  <CheckCheck size={24} aria-hidden="true" />
                </div>
                <h3>Согласование заказа</h3>
                <p>Согласуем предложенное оборудование и условия заказа. Все необходимые уточнения обсуждаем до подтверждения заказа.</p>
              </li>
            </ol>
            <div className={styles.delivery}>
              <h3>Поставка по России</h3>
              <p>{seller.deliveryNotice} Условия поставки укажем в КП.</p>
            </div>
          </div>
        </section>

        <section className={styles.details} aria-labelledby="seller-title">
          <div className={`${styles.container} ${styles.detailsGrid}`}>
            <div>
              <h2 id="seller-title">Реквизиты продавца</h2>
              <dl className={styles.requisites}>
                <div><dt>Организация</dt><dd>{seller.legalName}</dd></div>
                <div><dt>ИНН</dt><dd>{seller.taxId}</dd></div>
              </dl>
            </div>
            <nav className={styles.catalog} aria-labelledby="contacts-catalog-title">
              <h2 id="contacts-catalog-title">Оборудование в каталоге</h2>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/catalog/${category.id}`}>
                      <span>{category.cardTitle}</span>
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <SiteFooter />
    </>
  );
}
