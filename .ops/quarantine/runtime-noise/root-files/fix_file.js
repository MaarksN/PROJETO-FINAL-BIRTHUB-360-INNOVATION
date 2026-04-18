const fs = require('fs');

let content = fs.readFileSync('packages/database/test/engagement.test.ts', 'utf8');
content = content.replace(/\/\/ @ts-expect-error mock limitation\n/g, '');
content = content.replace(/\/\/ @ts-expect-error mock assignment\n/g, '');
content = content.replace(/\/\/ @ts-expect-error test mock limits\n/g, '');
content = content.replace(/\/\/ @ts-expect-error type limit\n/g, '');
content = content.replace(/\/\/ @ts-expect-error type evasion\n/g, '');
content = content.replace(/\/\/ @ts-expect-error test mock limit\n/g, '');

fs.writeFileSync('packages/database/test/engagement.test.ts', content);
