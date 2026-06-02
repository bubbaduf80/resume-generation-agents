# Resume and Cover Letter Multi-Agent Framework

This project helps tailor resumes and cover letters to specific jobs through four explicit agent passes:

1. **Job Analyst** extracts must-have and nice-to-have resume/cover-letter targets from the job description and company context.
2. **Application Writer** uses the job targets and your career inventory to draft tailored application materials.
3. **Hiring Manager Reviewer** reviews the draft adversarially for fit, gaps, risks, and recommended changes.
4. **Finalization Editor** works with your approved edits, regenerates PDFs, verifies page counts, and promotes drafts to final artifacts.

The goal is not to invent fit. The goal is to make real fit legible, identify missing evidence, and avoid over-claiming.

## What Is Critical To Add

Your process is strong, but four things are critical:

- **A truth and evidence gate.** The writer agent needs rules that every claim must map to evidence in your career inventory. No unsupported embellishment.
- **A resume strategy layer.** Before drafting, decide target level, positioning, resume version type, and which tradeoffs matter most. This prevents generic "keyword stuffing."
- **A final human approval step.** The reviewer can recommend changes, but you should approve any judgment-heavy edit, sensitive phrasing, or claim escalation.
- **A feedback loop.** The reviewer should not only grade the materials; it should produce a concrete revision brief that can be handed back to the writer.

Recommended optional additions:

- **ATS and keyword pass:** useful after the hiring-manager pass, but subordinate to truth and readability.
- **Company research source log:** when using external company information, store citations and dates.
- **Versioning by job:** every job gets its own folder with inputs, intermediate artifacts, final outputs, and decisions.

## Directory Layout

```text
agents/
  01-job-analyst.md
  02-application-writer.md
  03-hiring-manager-reviewer.md
  04-finalization-editor.md

config/
  project.yaml

data/
  career_inventory/
    README.md
    career_profile.template.md
    career_profile.md
    evidence_index.template.yaml
    evidence_index.yaml
    primary_evidence/
    supporting_material/
  jobs/
    _template/
      job_description.md
      company_research.md
      role_context.md

workflows/
  tailor-application.md

output/
  _template/
```

## Standard Job Workflow

If this is a fresh checkout, create your local private career inventory from the committed templates:

```bash
cp data/career_inventory/career_profile.template.md data/career_inventory/career_profile.md
cp data/career_inventory/evidence_index.template.yaml data/career_inventory/evidence_index.yaml
```

The working career files and supporting evidence are ignored by Git because they can contain personal or confidential information.

Create a job folder:

```text
data/jobs/company-role-yyyy-mm-dd/
```

Copy the three files from `data/jobs/_template/` into the new folder:

- `job_description.md`
- `company_research.md`
- `role_context.md`

Then run the agents in order:

1. Use `agents/01-job-analyst.md`.
   - Inputs: job description, company research, role context.
   - Output: `output/company-role-yyyy-mm-dd/01-job-target-brief.md`
2. Use `agents/02-application-writer.md`.
   - Inputs: job target brief, career inventory, evidence index.
   - Output: `output/company-role-yyyy-mm-dd/02-draft-resume.md`, `02-draft-resume.pdf`, `02-draft-cover-letter.md`, and `02-draft-cover-letter.pdf`
3. Use `agents/03-hiring-manager-reviewer.md`.
   - Inputs: job target brief, draft resume, draft cover letter, company research.
   - Output: `output/company-role-yyyy-mm-dd/03-review.md`
4. Use `agents/04-finalization-editor.md`.
   - Inputs: draft resume, draft cover letter, evidence map, review, and your approved edits or instructions.
   - Output: `output/company-role-yyyy-mm-dd/04-final-resume.md`, `04-final-resume.pdf`, `04-final-cover-letter.md`, `04-final-cover-letter.pdf`, `04-final-evidence-map.md`, and `04-finalization-notes.md`

## Invocation Pattern

Use this pattern in Codex or another agent environment:

```text
Follow agents/01-job-analyst.md.

Inputs:
- data/jobs/acme-senior-product-manager-2026-05-19/job_description.md
- data/jobs/acme-senior-product-manager-2026-05-19/company_research.md
- data/jobs/acme-senior-product-manager-2026-05-19/role_context.md

Write the output to:
- output/acme-senior-product-manager-2026-05-19/01-job-target-brief.md
```

Repeat the same pattern with the second, third, and fourth agent specs.

## Resume PDF Rendering

Agent 02 keeps Markdown as the editable source of truth and renders a polished PDF for human review:

```bash
scripts/render_resume_pdf.js output/company-role-yyyy-mm-dd/02-draft-resume.md output/company-role-yyyy-mm-dd/02-draft-resume.pdf
```

The renderer also writes a companion `.html` file for quick visual inspection.

Cover letters use the same renderer with a different stylesheet:

```bash
scripts/render_resume_pdf.js output/company-role-yyyy-mm-dd/02-draft-cover-letter.md output/company-role-yyyy-mm-dd/02-draft-cover-letter.pdf styles/cover-letter.css
```

## Operating Principles

- Prefer concrete evidence over generalized self-description.
- Preserve factual accuracy over perceived fit.
- Default to a 2-page resume. Expand only when a specific job clearly requires broader evidence.
- Simplify older or less-relevant experience before sacrificing readability or focus.
- Use the job description as the primary source of role requirements.
- Use company research to tune emphasis and tone, not to fabricate insider knowledge.
- Mark missing evidence clearly.
- Keep each intermediate artifact; it is part of the reasoning trail.
- Treat final Markdown files as the source of truth for final PDFs.
