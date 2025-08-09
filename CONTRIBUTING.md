## 🤝 How to Add a Tool

1. Fork the repo
2. Edit `tools.json` and add your tool (follow the format)
3. Open a Pull Request

### Tool Format

```json
{
  "name": "Tool Name",
  "url": "https://example.com",
  "githubUrl": "https://github.com/user/repo",
  "description": "Short, clear description.",
  "tags": ["LLM Apps", "API", "Python"],
  "hasApi": true,
  "hasCli": false,
  "useCases": ["No-Code Automation", "SaaS"],
  "license": "MIT",
  "stars": 1200,
  "lastUpdated": "2025-04-04"
}