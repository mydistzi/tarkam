import SEO from '@/components/SEO';

function TermsOfService() {
  return (
    <div className="policy-page">
      <SEO
        title="Terms of Service - Tarkam Discord Bot"
        description="Terms of Service for Tarkam Discord Bot. Read our terms and conditions for using the bot."
        keywords={["terms of service", "tos", "discord bot", "tarkam", "legal"]}
        type="website"
      />

      <div className="container">
        <div className="policy-content">
          <h1>Terms of Service – Tarkam Discord Bot</h1>
          <p className="last-updated">Last Updated: March 16, 2026</p>

          <p>These Terms of Service ("Terms") govern your use of the Tarkam Discord Bot ("Bot", "Service") operated by Dist ("Developer", "we", "us", "our").</p>

          <p>By inviting, accessing, or using the Bot through the Discord platform, you agree to be bound by these Terms. If you do not agree with these Terms, you must discontinue use of the Bot immediately.</p>

          <h2>1. Description of Service</h2>
          <p>Tarkam is a software bot designed to operate within the Discord platform. The Bot provides various features that may include, but are not limited to:</p>
          <ul>
            <li>Server moderation tools</li>
            <li>Automation and utility commands</li>
            <li>Community engagement features</li>
            <li>Entertainment or game-related functionality</li>
            <li>Integration with external services or APIs</li>
          </ul>
          <p>Features may be updated, modified, or removed at any time without prior notice.</p>
          <p>For more information about the Bot, visit: <a href="https://tarkam.fun" target="_blank" rel="noopener noreferrer">https://tarkam.fun</a></p>

          <h2>2. Eligibility</h2>
          <p>To use the Bot, you must:</p>
          <ul>
            <li>Be at least 13 years old or meet the minimum age requirement defined by Discord.</li>
            <li>Comply with all applicable laws and regulations.</li>
            <li>Follow the Discord Terms of Service and Discord Community Guidelines.</li>
          </ul>
          <p>Failure to comply may result in restricted access or permanent removal from the Service.</p>

          <h2>3. Acceptable Use</h2>
          <p>Users agree not to misuse the Bot, including but not limited to:</p>
          <ul>
            <li>Violating the Terms or policies of Discord</li>
            <li>Harassing, threatening, or abusing other users</li>
            <li>Sending spam or malicious commands</li>
            <li>Exploiting bugs or attempting unauthorized access</li>
            <li>Using the Bot for illegal activities</li>
            <li>Attempting to disrupt the functionality of the Bot</li>
          </ul>
          <p>The Developer reserves the right to suspend, restrict, or permanently ban users or servers that violate these rules.</p>

          <h2>4. Data Collection</h2>
          <p>To provide its functionality, the Bot may collect and process limited technical data such as:</p>
          <ul>
            <li>Discord User IDs</li>
            <li>Server (Guild) IDs</li>
            <li>Channel IDs</li>
            <li>Command usage logs</li>
            <li>Server configuration settings</li>
          </ul>
          <p>This data is used strictly for operational functionality, debugging, and improving the Service.</p>
          <p>We do not sell or share personal data with third parties except where required by law.</p>

          <h2>5. Data Storage & Retention</h2>
          <p>Some data may be stored temporarily or persistently depending on the features used by the server.</p>
          <p>Server administrators or users may request data removal by contacting us through the support server:</p>
          <p>Support Server: <a href="https://discord.gg/fnRhRkxTyC" target="_blank" rel="noopener noreferrer">https://discord.gg/fnRhRkxTyC</a></p>

          <h2>6. Service Availability</h2>
          <p>The Bot is provided "as is" and "as available."</p>
          <p>We do not guarantee that the Service will:</p>
          <ul>
            <li>Always be available or uninterrupted</li>
            <li>Be free from bugs or errors</li>
            <li>Meet every user's expectations</li>
          </ul>
          <p>The Developer reserves the right to modify, suspend, or discontinue the Bot at any time without prior notice.</p>

          <h2>7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Dist shall not be liable for:</p>
          <ul>
            <li>Data loss or corruption</li>
            <li>Server misconfigurations</li>
            <li>Service interruptions</li>
            <li>Indirect or consequential damages arising from use of the Bot</li>
          </ul>
          <p>Use of the Bot is at your own risk.</p>

          <h2>8. Termination</h2>
          <p>We reserve the right to:</p>
          <ul>
            <li>Restrict access to specific users or servers</li>
            <li>Remove the Bot from any server</li>
            <li>Suspend or terminate the Service entirely</li>
          </ul>
          <p>Users may stop using the Bot at any time by removing it from their server in Discord.</p>

          <h2>9. Changes to These Terms</h2>
          <p>We may update these Terms periodically.</p>
          <p>Continued use of the Bot after changes have been published constitutes acceptance of the revised Terms.</p>
          <p>Updates may be posted on:</p>
          <ul>
            <li><a href="https://tarkam.fun" target="_blank" rel="noopener noreferrer">https://tarkam.fun</a></li>
            <li>The official support server</li>
          </ul>

          <h2>10. Contact & Support</h2>
          <p>If you have questions regarding these Terms, please contact us through:</p>
          <p>Website: <a href="https://tarkam.fun" target="_blank" rel="noopener noreferrer">https://tarkam.fun</a></p>
          <p>Support Server: <a href="https://discord.gg/fnRhRkxTyC" target="_blank" rel="noopener noreferrer">https://discord.gg/fnRhRkxTyC</a></p>
          <p>Developer: Dist</p>

          <h2>11. Governing Law</h2>
          <p>These Terms shall be governed and interpreted in accordance with the laws of Indonesia, with jurisdiction in Jakarta, without regard to conflict of law principles.</p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;