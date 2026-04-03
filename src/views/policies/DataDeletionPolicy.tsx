import SEO from '@/components/SEO';

function DataDeletionPolicy() {
  return (
    <div className="policy-page">
      <SEO
        title="Data Deletion Policy - Tarkam Discord Bot"
        description="Data Deletion Policy for Tarkam Discord Bot. Learn how to request data removal."
        keywords={["data deletion", "gdpr", "data removal", "discord bot", "tarkam"]}
        type="website"
      />

      <div className="container">
        <div className="policy-content">
          <h1>Data Deletion Policy</h1>
          <p className="last-updated">Last Updated: March 16, 2026</p>

          <p>Tarkam allows users and server administrators to request deletion of stored data.</p>

          <h2>1. Types of Data Stored</h2>
          <p>The bot may store:</p>
          <ul>
            <li>Server configuration</li>
            <li>Command usage logs</li>
            <li>Discord identifiers (User ID, Server ID, Channel ID)</li>
          </ul>

          <h2>2. Data Removal Requests</h2>
          <p>To request deletion of stored data:</p>
          <ul>
            <li>Join the support server <a href="https://discord.gg/fnRhRkxTyC" target="_blank" rel="noopener noreferrer">https://discord.gg/fnRhRkxTyC</a></li>
            <li>Contact a developer or open a support request.</li>
          </ul>

          <h2>3. Processing Time</h2>
          <p>Data deletion requests are typically processed within 30 days.</p>

          <h2>4. Automatic Deletion</h2>
          <p>If the bot is removed from a server, associated server configuration data may be deleted automatically.</p>
        </div>
      </div>
    </div>
  );
}

export default DataDeletionPolicy;