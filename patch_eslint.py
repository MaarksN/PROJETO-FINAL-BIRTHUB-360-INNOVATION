import re
with open('eslint.config.mjs', 'r') as f:
    content = f.read()

# Add no-restricted-imports rule
rule = '"no-restricted-imports": ["error", {"name": "@birthub/db", "message": "Use @birthub/database instead. @birthub/db is restricted."}],'

if 'no-restricted-imports' not in content:
    content = content.replace('rules: {', 'rules: {\n      ' + rule)
    with open('eslint.config.mjs', 'w') as f:
        f.write(content)
