---
description: Compress a memory file into the compact register safe for LLM context
argument-hint: "<file path>"
---

Run the ta-compress skill on $ARGUMENTS. Follow that skill's pipeline exactly: compress the file's prose, preserve headings, code blocks, URLs, file paths, and commands byte-for-byte, write the result to the original path, and save a backup at <filename>.original.md. Never use the telegraph or morse registers for this — files an LLM re-reads as context must keep their stopwords.
