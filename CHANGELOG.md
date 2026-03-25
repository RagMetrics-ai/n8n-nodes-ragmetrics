# Changelog

## [0.1.11] - 2026-03-25
### Changed
- Removed erroneous self-dependency on `n8n-nodes-ragmetrics` so `npm ci` matches the lockfile

## [0.1.10] - 2026-02-19
### Changed
- Updated logo references to use `logo_bw.svg` for node and credential icons
- Updated GitHub Actions publish workflow to Node 24 (`actions/checkout@v5`, `actions/setup-node@v5`)

## [0.1.9] - 2026-02-19
### Changed
- Added GitHub Actions publish workflow with npm provenance support (`.github/workflows/publish.yml`)
- Updated credential test endpoint to `GET /v2/user/profile/` with Authorization header auth
- Standardized credential and node icons to use blue logo variant

## [0.1.8] - 2026-02-19
### Changed
- Credential test no longer sends API key in body; uses header auth via authenticate method
- Simplified credential authenticate (header-based Token auth)
- Node inputs/outputs use `NodeConnectionTypes.Main`
- Added required Resource and Operation (Evaluation / Evaluate) with displayOptions
- Removed logger usage in node (users cannot see output)
- Iterate over all input items (standard n8n pattern) instead of single-item cap
### Fixed
- Test mock: resource returns `evaluation`, expected request body matches node (conversation_id, no criteria/provider/model)
- Ragmetrics.node.json synced with node (resource, operation, displayName)
- Credentials typeOptions indentation

## [0.1.6] - 2026-01-20
### Fixed
- Default group is now ""
- Fixed typo in README: "you account" → "your account"

## [0.1.4] - 2026-01-20
### Changed
- Updated author email to hernan@ragmetrics.ai

## [0.1.3] - 2026-01-20
### Changed
- Updated repository URL to RagMetrics-ai organization

## [0.1.2] - 2026-01-20
### Changed
- Updated API response handling to include `results`, `conversation_id`, and `record_id` when status is "success"
- Renamed from RagmetricsAI to Ragmetrics across all files and references

## [0.0.1] - 2025-09-09
### Initial Release
- First public version of the Ragmetrics n8n node.
- Supports API credential authentication and basic evaluation resource.
- For information on API and Ragmetrics go to ragmetrics.com
