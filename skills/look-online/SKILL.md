---
name: look-online
description: Answer a question from the web, citing reliable sources and flagging weak ones.
disable-model-invocation: true
---

Answer the question from the web, in chat. Trace every claim to its **primary source**, the party that owns the fact: official docs, source code, specs, release notes, first-party blogs, peer-reviewed papers. Primary sources are **reliable**; everything else (blogs, tutorials, forums, Stack Overflow) is **weak**.

A claim only a weak source backs stays in the answer, marked weak, with the primary source that would confirm it. When sources disagree, the reliable one wins: say so.

```markdown
<the answer>

| Claim | Source       | Strength            |
| ----- | ------------ | ------------------- |
| ...   | [title](url) | reliable / **weak** |
```

Done when every claim in the answer has a row, and every weak row is marked.
