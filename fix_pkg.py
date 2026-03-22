import json

with open('package.json', 'r') as f:
    data = json.load(f)

# Revert .engines.pnpm = "9.1.0"
if 'pnpm' in data.get('engines', {}):
    del data['engines']['pnpm']

with open('package.json', 'w') as f:
    json.dump(data, f, indent=2)
