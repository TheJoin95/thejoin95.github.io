# Release record — fill after actual deployment

Status: **not released**. This is a worksheet, not verification evidence.
Current reviewed preview and known limits are linked in the [maintenance index](README.md).

| Field | Record the actual value |
| --- | --- |
| Owner approval / linked review | Pending |
| Release commit / PR / green CI run | Pending |
| Netlify site / configured production branch | Verify before release |
| New deploy ID / immutable URL | Pending |
| Intended canonical hostname / observed public URL | Pending |
| Published timestamp (UTC) / operator | Pending |
| Previous verified commit / deploy / smoke record | Pending |
| DNS provider, records and TTL before/after | Pending; record values, never credentials |
| Unrelated services that must stay intact | Pending |
| Indexing decision / actual headers and canonical | Pending |
| Routes, articles, aliases, CV/media, RSS/sitemap and OG proof | Pending |
| Human device / keyboard / assistive-technology proof | Pending |
| Netlify protection behaviour / outstanding blockers | Pending |
| Newsletter delivery and analytics checks, if performed | Pending; no keys or private recipient data |
| Performance: lab vs available field data | Pending |
| Corrective Git/DNS recovery plan and its verification | Pending |
| Final outcome and follow-up Linear tickets | Pending |

Link the completed record and public release from MIC-8, MIC-30 and MIC-31.
Never replace a pending result with an assumed success. Configuration secrets,
authentication tokens, private provider responses and customer data do not belong
in this record or in Linear. The linked [recovery procedure](deployment.md)
uses a corrective Git release; it does not claim a deploy-pointer rollback.
