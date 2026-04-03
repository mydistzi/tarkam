import SEO from '@/components/SEO';

function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <SEO
        title="Privacy Policy - Tarkam Discord Bot"
        description="Privacy Policy for Tarkam Discord Bot. Learn how we collect and use your data."
        keywords={["privacy policy", "data protection", "discord bot", "tarkam"]}
        type="website"
      />

      <div className="container">
        <div className="policy-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: March 16, 2026</p>

          <p>This Privacy Policy explains how Tarkam collects and processes data when used on Discord.</p>

          <h2>1. Information We Collect</h2>
          <p>To operate the bot, we may collect:</p>
          <ul>
            <li>Discord User IDs</li>
            <li>Server (Guild) IDs</li>
            <li>Channel IDs</li>
            <li>Command usage data</li>
            <li>Server configuration settings</li>
          </ul>
          <p>We do not collect personal information such as real names, addresses, or passwords.</p>

          <h2>2. How We Use Data</h2>
          <p>Collected data is used for:</p>
          <ul>
            <li>Executing commands</li>
            <li>Storing server settings</li>
            <li>Improving bot functionality</li>
            <li>Debugging errors</li>
          </ul>

          <h2>3. Data Storage</h2>
          <p>Data may be stored on secure servers operated by the developer.</p>
          <p>Data is retained only as long as necessary to provide the service.</p>

          <h2>4. Data Sharing</h2>
          <p>We do not sell or trade user data.</p>
          <p>Data may only be shared if:</p>
          <ul>
            <li>Required by law</li>
            <li>Required to protect the integrity of the service</li>
          </ul>

          <h2>5. Security</h2>
          <p>We implement reasonable technical measures to protect stored data.</p>
          <p>However, no online system can guarantee absolute security.</p>

          <h2>6. Your Rights</h2>
          <p>Server administrators may request removal of stored data.</p>
          <p>Requests can be submitted through the support server.</p>

          <h2>7. Changes</h2>
          <p>This Privacy Policy may be updated periodically.</p>
          <p>Continued use of the Bot indicates acceptance of any changes.</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;