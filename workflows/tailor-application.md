# Workflow: Tailor Application To A Specific Job

## Codex Workspace Requirement

Run this workflow from the saved/trusted Codex project rooted at:

```text
C:\Users\bubba\Documents\Codex\2026-05-19\i-want-to-create-a-multi
```

Do not run new job work from a parent `Codex` folder. The workflow creates and updates files under `data/jobs/{job_slug}/` and `output/{job_slug}/`; those paths should be inside the active Codex writable project root so normal job setup, draft writing, final Markdown creation, and final PDF rendering do not require repeated write approvals.

## Setup

1. Create a job slug:

```text
company-role-yyyy-mm-dd
```

2. Create:

```text
data/jobs/company-role-yyyy-mm-dd/
output/company-role-yyyy-mm-dd/
```

3. Copy the template input files from:

```text
data/jobs/_template/
```

4. Fill in:

- `job_description.md`
- `company_research.md`
- `role_context.md`

5. Update candidate files as needed:

- `data/career_inventory/career_profile.md`
- `data/career_inventory/evidence_index.yaml`
- `data/career_inventory/primary_evidence/`
- `data/career_inventory/supporting_material/`

## Agent 01 Invocation

```text
Follow agents/01-job-analyst.md.

Inputs:
- data/jobs/{job_slug}/job_description.md
- data/jobs/{job_slug}/company_research.md
- data/jobs/{job_slug}/role_context.md

Write:
- output/{job_slug}/00-context-packet.md
- output/{job_slug}/01-job-target-brief.md
```

## Agent 02 Invocation

```text
Follow agents/02-application-writer.md.

Resume version:
- Use `v1`, `v2`, or `both`.
- Default is `v2` when unspecified.

Cover letter:
- Default is no cover letter.
- Generate `02-draft-cover-letter.md` only when the user prompt explicitly asks for a cover letter or `data/jobs/{job_slug}/role_context.md` explicitly requests/requires one.

Resume length guidance:
- Target 2 pages by default.
- Compress less-relevant or older experience before expanding beyond 2 pages.
- Use more than 2 pages only if this specific job clearly requires it, and explain why in the evidence map.
- For `v2`, target the core resume to no more than 1000 words and 2 pages as a guideline, then add a separate appendix page with selected product/service leadership anecdotes.

Inputs:
- output/{job_slug}/00-context-packet.md if present
- output/{job_slug}/01-job-target-brief.md
- data/career_inventory/career_profile.md
- data/career_inventory/evidence_index.yaml
- data/career_inventory/primary_evidence/
- data/career_inventory/supporting_material/

Write:
- output/{job_slug}/02-draft-resume-v2.md by default, and when `v2` or `both` is requested
- output/{job_slug}/02-draft-resume.md when `v1` or `both` is requested
- output/{job_slug}/02-draft-cover-letter.md only when a cover letter is explicitly requested
- output/{job_slug}/02-evidence-map.md

Validation:
- Run `node scripts/check_profile_contact.js` against generated draft resume Markdown files and the cover-letter Markdown file if present. Resume email, phone, and LinkedIn URL must match `data/career_inventory/career_profile.md`; cover letters are checked for mismatched contact values if they include contact information.
- Run `node scripts/check_markdown_currency.js` against all generated Agent 02 Markdown outputs.
- Run `node scripts/check_v2_resume.js` against generated V2 resume Markdown files.
- Verify every employment heading uses the actual title in `data/career_inventory/career_profile.md`. If a parenthetical functional description is useful, place it as the first bullet or labeled paragraph beneath the role rather than in the title.
- If patents are mentioned, verify the wording states that the candidate is a named inventor on a total of 17 patents.
```

## Agent 03 Invocation

```text
Follow agents/03-hiring-manager-reviewer.md.

Inputs:
- output/{job_slug}/00-context-packet.md if present
- output/{job_slug}/01-job-target-brief.md
- output/{job_slug}/02-draft-resume-v2.md by default, and if present
- output/{job_slug}/02-draft-resume.md if present
- output/{job_slug}/02-draft-cover-letter.md if present
- output/{job_slug}/02-evidence-map.md
- data/jobs/{job_slug}/company_research.md
- data/jobs/{job_slug}/role_context.md

Write:
- output/{job_slug}/03-review.md
```

## Agent 04 Finalization Invocation

```text
Follow agents/04-finalization-editor.md.

Inputs:
- output/{job_slug}/00-context-packet.md if present
- output/{job_slug}/01-job-target-brief.md
- output/{job_slug}/02-draft-resume-v2.md by default
- output/{job_slug}/02-draft-resume.md if present
- output/{job_slug}/02-draft-cover-letter.md if present
- output/{job_slug}/02-evidence-map.md
- output/{job_slug}/03-review.md
- data/career_inventory/
- Candidate edit instructions or confirmation that the current draft Markdown files are approved.

Write:
- output/{job_slug}/04-final-resume-v2.md by default, and when `v2` or `both` is requested
- output/{job_slug}/04-final-resume-v2.pdf by default, and when `v2` or `both` is requested
- output/{job_slug}/04-final-resume.md when `v1` or `both` is requested
- output/{job_slug}/04-final-resume.pdf when `v1` or `both` is requested
- output/{job_slug}/04-final-cover-letter.md only when a cover letter was requested and drafted
- output/{job_slug}/04-final-cover-letter.pdf only when a cover letter was requested and drafted
- output/{job_slug}/04-final-evidence-map.md
- output/{job_slug}/04-finalization-notes.md
```

Agent 04 should promote approved draft Markdown to final Markdown, render PDFs only from the final Markdown files, verify final PDF page counts, and record finalization decisions.

Validation:
- Run `node scripts/check_profile_contact.js` against the approved draft and final resume Markdown files, plus cover-letter Markdown files if present, before rendering PDFs.
- Verify rendered final resume PDFs contain the career-profile email, phone, and LinkedIn URL.
- Run `node scripts/check_markdown_currency.js` against approved draft and final Markdown files.
- Run `node scripts/check_v2_resume.js` against approved draft and final V2 resume Markdown files.
- Verify final PDF page counts.

## Final Human Checklist

- All facts are true.
- Metrics are accurate.
- Dates and actual employment titles match `data/career_inventory/career_profile.md`; functional role descriptions appear only in role content when clarification is warranted.
- The resume does not overstate scope.
- If requested, the cover letter sounds like you.
- Any gaps are accepted consciously.
- Sensitive or confidential details are removed.
- Final resume PDF page count is acceptable.
- If requested, final cover letter PDF page count is acceptable.
- Final Markdown files are the source of truth for submitted PDFs.
