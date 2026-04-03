import SEO from '@/components/SEO';

function AcceptableUsePolicy() {
  return (
    <div className="policy-page">
      <SEO
        title="Acceptable Use Policy - Tarkam Discord Bot"
        description="Acceptable Use Policy for Tarkam Discord Bot. Read the rules for using our bot."
        keywords={["acceptable use policy", "rules", "discord bot", "tarkam"]}
        type="website"
      />

      <div className="container">
        <div className="policy-content">
          <h1>Acceptable Use Policy</h1>

          <p>Users of the Tarkam Bot on Discord must follow these rules.</p>

          <h2>Prohibited Activities</h2>
          <p>Users may not:</p>
          <ul>
            <li>Use the bot to spam or raid servers</li>
            <li>Exploit vulnerabilities</li>
            <li>Attempt to overload or disrupt the service</li>
            <li>Use automation to abuse commands</li>
            <li>Use the bot to distribute malware</li>
            <li>Harass or threaten other users</li>
          </ul>

          <h2>Enforcement</h2>
          <p>Violations may result in:</p>
          <ul>
            <li>Command restrictions</li>
            <li>User bans</li>
            <li>Server blacklisting</li>
            <li>Permanent removal of access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AcceptableUsePolicy;