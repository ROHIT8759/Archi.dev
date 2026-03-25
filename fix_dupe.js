const fs = require('fs');
let c = fs.readFileSync('components/landing/ScrollSequence.tsx', 'utf8');
let startStr = import { useRef, useState } from "react";;
let endStr = ];\n\nexport default function ScrollSequence() {;
let startIndex = c.indexOf(startStr);
let endIndex = c.indexOf(endStr);
if (startIndex !== -1 && endIndex !== -1) {
    let newC = c.substring(0, startIndex) + export default function ScrollSequence() { + c.substring(endIndex + endStr.length);
    fs.writeFileSync('components/landing/ScrollSequence.tsx', newC);
    console.log('Fixed');
} else {
    console.log('Not found: ', startIndex, endIndex);
}
