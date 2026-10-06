# Public translation corrections

The English, French and Turkish public interfaces now resolve incomplete Arabic CMS fields using checked-in translations in `lib/generated/public-content-translations.json`. This covers page descriptions, body sections, project reports, campaign display metadata, navigation and existing policy content. Arabic remains unchanged. Translation happens locally during rendering; the application does not call a translation provider for visitors.

The resolver preserves IDs, slugs, block types, categories, links, media paths, dates and original author identity fields. Valid existing translations remain authoritative. Authentication and validation messages use a separate small interface dictionary. Email verification keeps the selected language when linking or redirecting to login. Policy writing direction follows the selected locale.

The audit checked 105 public routes across English, French and Turkish, including pages, project and news articles, campaigns, login, donation, cart and password/verification pages. No Arabic text was found in visible content, metadata, alt text, placeholders or accessibility labels after correction. The existing intentionally unavailable `license` route continues to return 404. Account state and error handling were checked through unit tests without creating users, sending emails or processing payments.

Validation: production build, TypeScript, 20 focused/regression tests, and checks that translated numbers, percentages, dates and contact email addresses preserve their meaning. French/Turkish schedules use equivalent 24-hour times.

Only text returned by unauthenticated public pages was sent to translation providers while preparing the static dictionary. Database snapshots, private records, secrets and source code were not exported. The project’s existing Groq provider was used when the initial translation service became rate limited. No API key, email domain, database connection or live database record was changed.

Future editorial updates should include complete native CMS translations. When an Arabic source changes, an old dictionary entry does not override the new text. Add/review the corresponding translation or update the CMS rather than silently hiding untranslated content.
