# Portfolio action measurement

The existing GA4 property receives these events from the canonical production
origin. The events carry names without custom parameters.

| Event | Counts |
| --- | --- |
| `contact_email_click` | Activation of the footer email link |
| `cv_download_click` | Activation of the footer CV download link |
| `newsletter_signup_requested` | A successful response to a genuine newsletter request |

A contact click does not establish that an email was sent. A CV click does not
establish that the file finished downloading. The newsletter request does not
establish that the recipient completed double opt-in. Keep these action counts
separate from GA4’s automatically collected or enhanced-measurement events.

GA4 requires a valid measurement ID and a browser origin that matches the
configured canonical origin. Netlify’s preview and branch contexts also clear
the measurement ID. The test fixture mocks Google’s tag script and the
newsletter provider path. It checks the canonical origin, the preview origin,
the accepted request and the failed or honeypot submissions without writing to
the analytics property.

After release, check the exact names in GA4 and compare a closed 28-day window.
Use page location to check for host contamination before comparing windows.
Traffic collected before these events become available stays as a separate
baseline. Query clicks and indexing coverage come from the webmaster tools.

[GA4 event setup](https://developers.google.com/analytics/devguides/collection/ga4/events)
