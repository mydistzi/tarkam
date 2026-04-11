import { ContactForm, PageHeader } from "@/galactic/common";

type ContactContentProps = {
  address?: string;
  email?: string;
  phone?: string;
};

const ContactContent = ({ address, email, phone }: ContactContentProps) => (
  <>
    <div className="map-wrapper">
      <iframe
        allowFullScreen
        height="350"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.06603201477!2d106.68943159585048!3d-6.229728020723366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f5c2b6f5d9%3A0x301576d14feb9c0!2sJakarta!5e0!3m2!1sen!2sid!4v1712745600000!5m2!1sen!2sid"
        style={{ border: 0 }}
        title="Tarkam location map"
        width="100%"
      />
    </div>
    <PageHeader
      eyebrow="Kontak"
      title="Hubungi Tim Tarkam"
      description="Detail kontak dan link sosial di footer sekarang diambil dari pengaturan live, sambil tetap jaga layout galactic."
    />
    <section className="contact-section padding-top">
      <div className="container">
        <div className="row">
          <div className="col-md-6 sm-padding">
            <div className="contact-details-wrap">
              <div className="contact-title">
                <h2>Punya <span>Pertanyaan?</span></h2>
                <p>Kontak kami buat bahas turnamen, registrasi roster, partnership, atau merchandise.</p>
              </div>
              <ul className="contact-details">
                <li><i className="fas fa-map-marker-alt" />{address || "Jakarta, Indonesia"}</li>
                <li><i className="fas fa-envelope" />{email || "hello@tarkam.fun"}</li>
                <li><i className="fas fa-phone" />{phone || "+62"}</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6 sm-padding">
            <div className="contact-title">
              <h2>Drop Us A <span>Line</span></h2>
              <p>Use the galactic contact form for the polished front-end experience while the live contact data stays in sync with the API settings.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  </>
);

export { ContactContent };
