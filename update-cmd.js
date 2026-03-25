const fs = require('fs');
let c = fs.readFileSync('components/studio/CommandPalette.tsx', 'utf8');

let commandsReplaced =   const commands = [
    { id: "1", type: "Add Process Node", icon: Terminal, action: () => { setOpen(false); addNode("process", { x: Math.random() * 200, y: Math.random() * 200 }); } },
    { id: "2", type: "Add Database Node", icon: Plus, action: () => { setOpen(false); addNode("database", { x: Math.random() * 200, y: Math.random() * 200 }); } },
    { id: "3", type: "Export Diagram", icon: Terminal, action: () => { setOpen(false); alert("Diagram exported to JSON."); } },
    { id: "4", type: "Open Settings", icon: Settings, action: () => { setOpen(false); window.location.href = '/settings'; } },
    { id: "5", type: "Go to Dashboard", icon: Search, action: () => { setOpen(false); window.location.href = '/dashboard'; } },
  ];;

let startIdx = c.indexOf('const commands = [');
let endIdx = c.indexOf('];', startIdx);
if (startIdx > -1 && endIdx > -1) {
  let c2 = c.substring(0, startIdx) + commandsReplaced + c.substring(endIdx + 2);
  fs.writeFileSync('components/studio/CommandPalette.tsx', c2);
  console.log("Updated CommandPalette.tsx");
} else {
  console.log("Failed to find commands array.");
}
