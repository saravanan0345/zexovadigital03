<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Admin area lives at /admin (ssr:false layout with inline login); access is the single admin role via has_role, first signup claims it through claim_first_admin. Why: one administrator, no client accounts.
- Project images go in the private project-images bucket and are stored as long-lived signed URLs. Why: workspace blocks public buckets.
- "Startups Trusted Us" homepage carousel reads the separate startup_projects table (admin-managed at /admin/startups), not the portfolio projects table. Why: keeps the existing portfolio strip unchanged.
- New enquiries are emailed to the business inbox via the Resend connector (gateway) from submitInquiry after the row is saved; email failures are logged, never block the submission. Why: the saved enquiry is the source of truth.
