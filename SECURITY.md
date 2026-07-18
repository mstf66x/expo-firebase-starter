# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Instead, use
GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository, or email the maintainer listed in `package.json`.

## Secrets

This starter **never** commits secrets. The following files are gitignored and
must be provided locally by each developer:

- `.env`
- `google-services.json` (Android Firebase config)
- `GoogleService-Info.plist` (iOS Firebase config)
- Signing keys (`*.p8`, `*.p12`, `*.mobileprovision`)

If you find a committed secret, rotate it immediately and open a private report.
