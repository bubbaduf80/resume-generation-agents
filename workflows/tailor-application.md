# Workflow: Tailor Application To A Specific Job

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
- output/{job_slug}/01-job-target-brief.md
```

## Agent 02 Invocation

```text
Follow agents/02-application-writer.md.

Resume length guidance:
- Target 2 pages by default.
- Compress less-relevant or older experience before expanding beyond 2 pages.
- Use more than 2 pages only if this specific job clearly requires it, and explain why in the evidence map.

Inputs:
- output/{job_slug}/01-job-target-brief.md
- data/career_inventory/career_profile.md
- data/career_inventory/evidence_index.yaml
- data/career_inventory/primary_evidence/
- data/career_inventory/supporting_material/

Write:
- output/{job_slug}/02-draft-resume.md
- output/{job_slug}/02-draft-resume.pdf
- output/{job_slug}/02-draft-cover-letter.md
- output/{job_slug}/02-draft-cover-letter.pdf
- output/{job_slug}/02-evidence-map.md
```

## Agent 03 Invocation

```text
Follow agents/03-hiring-manager-reviewer.md.

Inputs:
- output/{job_slug}/01-job-target-brief.md
- output/{job_slug}/02-draft-resume.md
- output/{job_slug}/02-draft-cover-letter.md
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
- output/{job_slug}/01-job-target-brief.md
- output/{job_slug}/02-draft-resume.md
- output/{job_slug}/02-draft-cover-letter.md
- output/{job_slug}/02-evidence-map.md
- output/{job_slug}/03-review.md
- data/career_inventory/
- Candidate edit instructions or confirmation that the current draft Markdown files are approved.

Write:
- output/{job_slug}/04-final-resume.md
- output/{job_slug}/04-final-resume.pdf
- output/{job_slug}/04-final-cover-letter.md
- output/{job_slug}/04-final-cover-letter.pdf
- output/{job_slug}/04-final-evidence-map.md
- output/{job_slug}/04-finalization-notes.md
```

Agent 04 should regenerate the draft PDFs first, verify page counts, promote approved draft Markdown to final Markdown, render final PDFs, and record finalization decisions.

## Final Human Checklist

- All facts are true.
- Metrics are accurate.
- Dates and titles are correct.
- The resume does not overstate scope.
- The cover letter sounds like you.
- Any gaps are accepted consciously.
- Sensitive or confidential details are removed.
- Final resume PDF page count is acceptable.
- Final cover letter PDF page count is acceptable.
- Final Markdown files are the source of truth for submitted PDFs.
