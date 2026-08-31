# RheumDx Work-up Assistant v10

Clinician-facing rheumatology diagnostic/work-up decision-support prototype.

## Important

- For qualified clinician use only.
- This is not a validated medical device or autonomous diagnostic system.
- Clinical judgement and urgent escalation pathways take precedence.
- Classification criteria are not equivalent to diagnosis.
- OCR text from clinical letters must be checked against the source images before analysis.
- Common identifiers are masked before analysis; clinicians should avoid entering patient names/MRNs where possible.

## Letter-image workflow

1. Select one or more images/screenshots of a clinical letter.
2. Reorder and rotate pages if required.
3. Run browser-side OCR.
4. Review and correct the editable transcription against the original images.
5. Confirm the OCR review checkbox.
6. Analyse. The application performs a fresh de-identification pass immediately before clinical reasoning.

OCR uses Tesseract.js in the browser. The initial language/runtime assets are loaded from a CDN; selected clinical images are not intentionally uploaded by the application.

## GitHub Pages

This repository includes `.github/workflows/pages.yml` for GitHub Pages deployment from `main`.

In GitHub:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

Then push to `main` or manually run the workflow.

## Files

- `index.html` — application
- `CLINICAL_SAFETY.md` — safety notes
- `.github/workflows/pages.yml` — Pages deployment
- `.nojekyll` — static-site compatibility
