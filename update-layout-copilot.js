const fs = require('fs');
let content = fs.readFileSync('components/studio/StudioLayout.tsx', 'utf8');

if (!content.includes('CopilotChatPill')) {
  content = content.replace(
    'import { CommandPalette } from "./CommandPalette";',
    'import { CommandPalette } from "./CommandPalette";\nimport { CopilotChatPill } from "./CopilotChatPill";'
  );

  content = content.replace(
    '<CommandPalette />',
    '<CommandPalette />\n      <CopilotChatPill />'
  );

  fs.writeFileSync('components/studio/StudioLayout.tsx', content);
  console.log('StudioLayout updated with CopilotChatPill');
}
