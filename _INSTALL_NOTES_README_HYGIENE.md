# README Hygiene Install Notes

This mini package replaces the default Astro starter README with a ProTreeTrim-specific technical README.

## Files included

```txt
README.md
_INSTALL_NOTES_README_HYGIENE.md
```

## Install

From the project root:

```bash
cp ~/Desktop/protreetrim-readme-hygiene.zip .
rm -rf _readme_hygiene_preview
mkdir _readme_hygiene_preview
unzip -o protreetrim-readme-hygiene.zip -d _readme_hygiene_preview
cp _readme_hygiene_preview/README.md README.md
cp _readme_hygiene_preview/_INSTALL_NOTES_README_HYGIENE.md .
```

## Check

```bash
git status --short
```

Expected:

```txt
M README.md
?? _INSTALL_NOTES_README_HYGIENE.md
?? _readme_hygiene_preview/
?? protreetrim-readme-hygiene.zip
```

## Commit

```bash
git add README.md _INSTALL_NOTES_README_HYGIENE.md
git commit -m "Update project README"
git pull --rebase origin main
git push origin main
```

## Clean temporary files after push

```bash
rm -rf _readme_hygiene_preview protreetrim-readme-hygiene.zip
git status --short
```
