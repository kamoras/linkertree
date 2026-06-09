# Security Policy

## Supported Versions

Linkertree is an actively developed project. Security fixes are applied to the
`main` branch.

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues.

Instead, use GitHub's [private vulnerability reporting][advisories] for this
repository (Security → Report a vulnerability), or contact the maintainers
privately.

When reporting, please include:

- A description of the vulnerability and its impact
- Steps to reproduce
- Affected versions/commit, if known

We aim to acknowledge reports within a few days and will keep you informed of
progress toward a fix.

## Deployment hardening notes

When self-hosting:

- Always set a strong, unique `NEXTAUTH_SECRET` (`openssl rand -base64 32`).
- Use HTTPS in production and set `NEXTAUTH_URL` to your canonical HTTPS domain.
- Never commit your `.env` file (it is gitignored by default).
- Keep dependencies up to date — Dependabot is enabled in this repo.

[advisories]: https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability
