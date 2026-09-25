# Separate admins in one project and database

## Routing and data

- `forrelief.org/admin` and `www.forrelief.org/admin` use the existing `public` schema.
- `destekol.org/admin` and `www.destekol.org/admin` use the new `destekol` schema in the same Supabase project.
- `SITE_ID=forrelief` or `SITE_ID=destekol` selects the site for an explicitly configured preview deployment. Without it, localhost defaults to 4Relief; unknown hosts are rejected.
- The same domain selection governs public CMS reads, admin writes, translations, settings, users, invitations, donations, mail and RPCs. There is no client-supplied schema/site selector.
- Admin and donor JWTs contain a site claim. Old tokens and tokens from the other site are rejected. Admin membership is rechecked against the selected site's User table on every request.
- Translation caches include the site. Uploaded files use a site-specific prefix in the existing media bucket. Existing image URLs remain unchanged.

No homepage sections, project content, public page design, or policies are replaced by this change. The homepage and project components continue to read admin-managed content through the existing queries.

## Deployment order (not executed against production)

1. Back up the database and test `supabase/tenant_isolation.sql` on a staging copy. The migration preserves public tables, creates a separate schema and copies CMS content/settings verbatim. It fails rather than overwriting an existing schema or silently reusing custom triggers/sequence defaults. Review any reported database-specific dependency first.
2. Add `destekol` to Supabase's exposed API schemas. Only the server service role receives access; do not grant browser roles access to settings/users.
3. Provision the first Destekol administrator explicitly. Existing users, memberships, invites, sessions, subscriptions and financial records are NOT duplicated. If the owner chooses their existing ADMIN login, `supabase/provision_destekol_admin.sql` copies only that selected login after an explicit email parameter is set. It refuses to overwrite an existing Destekol administrator. A different account must be provisioned separately. Initial administrator selection requires the owner's choice; subsequent invites are sent from the correct site.
4. Review copied integration settings. They start with the existing values to avoid silently changing configuration. Set separate SMTP/payment credentials in each site's admin as appropriate. Environment fallbacks for Destekol must be prefixed `DESTEKOL_` (for example `DESTEKOL_STRIPE_SECRET_KEY`, `DESTEKOL_SMTP_HOST`). 4Relief supports `FORRELIEF_` and legacy unprefixed values. The common Supabase connection and session signing secret remain shared infrastructure.
5. Deploy the code after database preparation. Log in again on each domain; old sessions intentionally expire. Configure each payment provider's webhooks against that site's domain. Historical records remain in public until their ownership is explicitly reviewed; do not assign financial records by guessing the originating site.
6. Verify in staging: edit a page/settings/translation on one site and confirm the other is unchanged; copy an admin bearer token to the other site's host and confirm rejection; remove a staff account and confirm its old token no longer works; exercise each site's own invitation, upload, email and payment sandbox flows.

Future database migrations must target both schemas. Never run a generic seed/reset against either site's production content. The schema clone is a one-time migration, not a synchronisation mechanism.

## Validation

The Node tests in `scripts/tenant-isolation.test.cjs` exercise exact domain selection, real Supabase request profile headers for reads/writes/RPCs, cross-site JWT rejection, membership removal, role changes and translation cache isolation. They use synthetic data and do not modify production. The migration still requires a staging run against the actual database schema, especially if it has custom triggers or dependencies absent from the repository.
