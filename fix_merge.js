const fs = require('fs');

function mergeCustom(content) {
  let lines = content.split('\n');
  let result = [];
  let inConflict = false;
  let currentBlock = [];
  let blockState = 0; // 0 normal, 1 upstream, 2 dividers, 3 stashed
  
  // This simplistic approach just removes the conflict markers but keeps BOTH sets of code if it's EventManager
  // Actually regex replacement:
  // For EventManagerPage.tsx
  let f = content;
  
  // Replace the first conflict in EventManagerPage.tsx
  f = f.replace(/<<<<<<< Updated upstream[\s\S]*?if \(!combinedSearchTerm\) return true;[\s\S]*?=======\s*if \(\(\!rawData \|\| rawData\.length === 0\) && !event\.id\.startsWith\('EVENT\#'\)\) \{[\s\S]*?>>>>>>> Stashed changes/, (match) => {
     // I will just use node script to manually splice the lines in node. 
  });
}
