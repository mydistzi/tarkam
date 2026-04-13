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
      title="Pusat Bantuan Tarkam"
      description="Selamat datang di Pusat Bantuan Tarkam. Kami siap membantu Anda memahami cara berkompetisi, bergabung dengan komunitas, dan menikmati layanan kami."
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
