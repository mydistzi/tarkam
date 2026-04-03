import React from 'react';

const DiscordWidget: React.FC = () => {
  // Replace with your actual server ID
  const serverId = '1476687763708575996'; 
  const widgetUrl = `https://discordapp.com/widget?id=${serverId}&theme=dark&username=mydistzi`;

  return (
    <div className="discord-widget-container">
      <iframe
        src={widgetUrl}
        width="320"
        height="280"
        allowTransparency={true}
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        title="Discord Widget"
      ></iframe>
    </div>
  );
};

export default DiscordWidget;
