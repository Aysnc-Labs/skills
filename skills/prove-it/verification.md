# Verification checklist

Areas a careful human tester keeps in mind when testing a change on this project. The `aysnc:prove-it` skill's verifier weighs each one against the changed surface and tests the ones that apply. Add your project's own risks.

- **Does it work:** every behaviour the PR changed, for visitors and for editors, including failure paths, edge cases and wrong input.
- **Does it look right:** on mobile, tablet and desktop, with nothing broken, missing or out of place.
- **Is it accessible:** WCAG 2.2 AA, by keyboard as well as by mouse.
- **Is it safe:** the OWASP Top 10, as far as the change reaches.
- **Is it private:** consent before tracking, and no personal data where it shouldn't be.
- **Is it found:** status codes, canonical, robots and structured data are right for search engines.
- **Is it clean:** no console errors, failed requests, placeholder copy or dead links.
