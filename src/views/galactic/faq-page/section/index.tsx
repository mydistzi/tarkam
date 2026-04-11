import { ContactDetails, FaqAccordion, PageHeader } from "@/galactic/common";

type FaqContentProps = {
  location?: string;
  email?: string;
  phone?: string;
};

const FaqContent = ({ location, email, phone }: FaqContentProps) => (
  <>
    <PageHeader
      eyebrow="Bantuan & FAQ"
      title="Pertanyaan yang Sering Diajukan"
      description="FAQ komunitas dan turnamen sekarang tampil di accordion, lengkap dengan data kontak live di kartu support."
    />
    <section className="faq-section padding-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 sm-padding">
            <FaqAccordion />
          </div>
          <div className="col-lg-4 sm-padding">
            <div className="sidebar-widget">
              <div className="widget-title">
                <h3>Masih Butuh Bantuan?</h3>
              </div>
              <p>Hubungi support untuk tanya tentang partnership, event, atau registrasi.</p>
              <ContactDetails location={location} email={email} phone={phone} />
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export { FaqContent };
