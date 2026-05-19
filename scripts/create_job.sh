#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: scripts/create_job.sh COMPANY ROLE [YYYY-MM-DD]" >&2
  echo "Example: scripts/create_job.sh acme senior-product-manager 2026-05-19" >&2
  exit 1
fi

company="$1"
role="$2"
date="${3:-$(date +%Y-%m-%d)}"
slug="${company}-${role}-${date}"

job_dir="data/jobs/${slug}"
out_dir="output/${slug}"

mkdir -p "$job_dir" "$out_dir"
cp data/jobs/_template/job_description.md "$job_dir/job_description.md"
cp data/jobs/_template/company_research.md "$job_dir/company_research.md"
cp data/jobs/_template/role_context.md "$job_dir/role_context.md"
cp output/_template/README.md "$out_dir/README.md"

cat <<MSG
Created job workspace:

  ${job_dir}
  ${out_dir}

Next:
  1. Fill in ${job_dir}/job_description.md
  2. Fill in ${job_dir}/company_research.md
  3. Fill in ${job_dir}/role_context.md
  4. Follow workflows/tailor-application.md with job_slug=${slug}
MSG

