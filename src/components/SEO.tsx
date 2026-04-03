import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  articleSection?: string;
  articleTag?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  keywords = [],
  siteName = 'Tarkam',
  twitterCard = 'summary_large_image',
  articleSection,
  articleTag = []
}) => {
  // Default values
  const defaultTitle = 'TARKAM | Streaming and WAR';
  const defaultDescription = 'Tarkam community, gameplay, and rewards. Join us for fun and exciting gaming experiences.';
  const defaultImage = '/logo.png'; // Default image for social sharing
  const defaultUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Use provided values or defaults
  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || defaultUrl;

  // Create full title with site name
  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;

  // Create keywords string
  const keywordsString = keywords.length > 0 ? keywords.join(', ') : 'meta, tarkam, dolmet, idm, metaverse';

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author || siteName} />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageImage} />

      {/* Article specific meta tags */}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && articleSection && (
        <meta property="article:section" content={articleSection} />
      )}
      {type === 'article' && articleTag.length > 0 && articleTag.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Additional meta tags for better SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
      <meta name="theme-color" content="#262626" />

      {/* Favicon and icons */}
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/icons/maskable/logo72.png" />
      <link rel="apple-touch-icon" sizes="96x96" href="/icons/maskable/logo96.png" />
      <link rel="apple-touch-icon" sizes="128x128" href="/icons/maskable/logo128.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/maskable/logo144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/maskable/logo152.png" />
      <link rel="apple-touch-icon" sizes="192x192" href="/icons/maskable/logo192.png" />
      <link rel="apple-touch-icon" sizes="384x384" href="/icons/maskable/logo384.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/maskable/logo512.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/icons/rounded/logo72.png" />
      <link rel="apple-touch-icon" sizes="96x96" href="/icons/rounded/logo96.png" />
      <link rel="apple-touch-icon" sizes="128x128" href="/icons/rounded/logo128.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/rounded/logo144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/rounded/logo152.png" />
      <link rel="apple-touch-icon" sizes="192x192" href="/icons/rounded/logo192.png" />
      <link rel="apple-touch-icon" sizes="384x384" href="/icons/rounded/logo384.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/rounded/logo512.png" />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'WebSite',
          "name": pageTitle,
          "description": pageDescription,
          "url": pageUrl,
          "image": pageImage,
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": pageImage
            }
          },
          ...(type === 'article' && author && {
            "author": {
              "@type": "Person",
              "name": author
            }
          }),
          ...(type === 'article' && publishedTime && {
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime
          })
        })}
      </script>
    </Helmet>
  );
};

export default SEO;