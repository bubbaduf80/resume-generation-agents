# Career Inventory

This folder holds the candidate-specific source material used by the resume agents.

The working files in this folder can contain personal contact details, employment history, private metrics, referrals, performance reviews, and other sensitive evidence. They are intentionally ignored by Git:

- `career_profile.md`
- `evidence_index.yaml`
- `primary_evidence/**`
- `supporting_material/**`

Use the committed templates to create local working files:

```bash
cp data/career_inventory/career_profile.template.md data/career_inventory/career_profile.md
cp data/career_inventory/evidence_index.template.yaml data/career_inventory/evidence_index.yaml
```

Keep supporting evidence local unless it has been redacted or encrypted before committing.
