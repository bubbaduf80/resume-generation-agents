# Workflow Edit Scope

This file lists the folders Codex may create or update during normal resume workflow work when this repository is opened as the active Codex project root.

Expected project root:

```text
C:\Users\bubba\Documents\Codex\2026-05-19\i-want-to-create-a-multi
```

This list documents intent for the workflow. Actual write permission still depends on opening the repository as the Codex project/workspace root or otherwise granting the folder as a writable root.

## Default Workflow-Owned Folders

Codex may edit these folders without asking for extra confirmation during ordinary job setup, drafting, review, finalization, validation, and rendering:

- `data/jobs/`
  - Create and update per-job input folders such as `data/jobs/{job_slug}/`.
  - Update `job_description.md`, `company_research.md`, and `role_context.md`.
  - Update `data/jobs/_template/` when changing reusable job-input templates.
- `output/`
  - Create and update per-job output folders such as `output/{job_slug}/`.
  - Write Agent 01-04 Markdown artifacts.
  - Render final PDFs and companion final HTML files from Agent 04.
  - Keep draft PDFs out of this folder unless the workflow is intentionally changed.
- `agents/`
  - Update agent prompt specifications when changing workflow behavior.
- `workflows/`
  - Update workflow invocation and operating instructions.
- `config/`
  - Update project defaults, quality gates, supported output formats, and this edit-scope file.
- `scripts/`
  - Update workflow validation, setup, and rendering scripts.
- `styles/`
  - Update resume and cover-letter CSS stylesheets, including versioned formats such as V1 and V2.

## Conditional Or Sensitive Folders

- `data/career_inventory/`
  - Read during workflow runs.
  - Edit only when the user asks to update career evidence, contact information, templates, or supporting material.
  - Treat working inventory files and supporting evidence as private/local data.
- Repository root files
  - Edit only when the change is workflow-related, such as `README.md`, `.gitignore`, `package.json`, or `package-lock.json`.
- `.git/`
  - Do not edit directly.
  - Use Git commands for status, commit, push, and repository inspection.
- `node_modules/`
  - Do not hand-edit.
  - Update only through package-management commands.

## Normal Workflow Actions Covered

- Create a new job folder from templates.
- Populate or update job description, company research, and role context.
- Run Agent 01 and write the job target brief.
- Run Agent 02 and write the requested resume format plus evidence map.
- Write a cover letter only when explicitly requested or required by role context.
- Run Agent 03 and write the hiring-manager review.
- Run Agent 04 and write final Markdown, final evidence map, finalization notes, final PDFs, and companion final HTML files.
- Run validation scripts for currency, contact data, page counts, V2 appendix separation, and related quality gates.

