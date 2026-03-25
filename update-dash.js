const fs = require('fs');
let c = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

c = c.replace(/className="cyber-glass rounded-2xl p-5 group cursor-pointer"/g, 'className="cyber-glass rounded-2xl p-5 group cursor-pointer relative overflow-hidden"');

let target = '                    onClick={() => router.push("/studio")}\n                  >';
let replacement = target + 
                    {/* SVG Map Background Background */}
                    <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none" style={{ color: project.tabColor }}>
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <defs>
                          <pattern id={\gridPattern-\\} width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.5" />
                          </pattern>
                          <linearGradient id={\ade-\\} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill={\url(#gridPattern-\)\} />
                        <path d="M -20,30 C 40,30 60,80 120,80 S 180,20 250,40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6"/>
                        <path d="M 0,90 Q 60,90 80,40 T 200,60" fill="none" stroke={\url(#fade-\)\} strokeWidth="2" opacity="0.8"/>
                        <circle cx="120" cy="80" r="4" fill="currentColor" stroke="#000" strokeWidth="2" />
                        <circle cx="200" cy="60" r="3" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="relative z-10">;

let split = c.split(target);
if (split.length > 1) {
  let finalC = split[0];
  for (let i = 1; i < split.length; i++) {
     let segment = split[i];
     segment = segment.replace('                  </div>\n                </motion.div>', '                  </div>\n                  </div>\n                </motion.div>');
     finalC += replacement + segment;
  }
  fs.writeFileSync('app/dashboard/page.tsx', finalC);
  console.log("Updated app/dashboard/page.tsx SVGs");
} else {
  console.log("Could not find target string.");
}
