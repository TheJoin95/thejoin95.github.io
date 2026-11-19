import type { CaseStudy } from "./case-studies";

const certo = "https://github.com/Schroedinger-Hat/certo";
const audio = "https://github.com/TheJoin95/ambisonics-3d-audio";
const wrapped = "https://github.com/Schroedinger-Hat/open-source-wrapped";
const podcast = "https://github.com/Schroedinger-Hat/youtube-to-spotify";

export const sideProjectStories = [
  {
    project: { id: "certo", title: "Certo", status: "Open-source project", media: [],
      summary: "Create, issue, and verify digital badges and credentials.",
      contribution: "I contributed the Nuxt 4 and pnpm migration." },
    published: true,
    introduction: "A community-built platform for issuing digital credentials for courses, workshops, and conferences.",
    team: "Certo is a Schrödinger Hat project. Credential issuance and verification are team work.",
    sections: [
      { id: "problem", title: "Give achievements a portable record", paragraphs: ["An event organizer needs to issue a credential to many people, while the recipient needs something they can keep, share, and have independently verified. Certo connects those workflows in one platform."] },
      { id: "decisions", title: "Start with an achievement", paragraphs: ["The issuer defines what a badge represents once, then issues individual credentials against that definition. The project uses Open Badges 3.0 and the Verifiable Credentials data model to make those records interpretable outside the issuing interface."] },
      { id: "implementation", title: "Modernise the frontend toolchain", paragraphs: ["My contribution was the Nuxt 4 and pnpm migration. The merged change records the framework and package-manager work alongside the existing credential features."], links: [{ href: `${certo}/pull/115`, label: "Read the merged migration pull request" }] },
      { id: "evidence", title: "Read the public implementation", paragraphs: ["The repository documents the achievement, issuance, and verification flow and contains the frontend and API. It remains the source for implementation details."], links: [{ href: certo, label: "Explore Certo on GitHub" }] },
    ],
  },
  {
    project: { id: "vitni", title: "Vitni", status: "Repair guide project", media: [],
      summary: "Find and follow illustrated guides for everyday repairs.",
      contribution: "I worked on guide search, detailed repair steps, and the English and French experience." },
    published: true,
    introduction: "An installable repair-guide app for people who want to keep everyday objects in use.",
    team: "This case study covers the Vitni repair-guide app.",
    sections: [
      { id: "problem", title: "Make the first repair step easier", paragraphs: ["A person looking at a broken object needs something practical they can do next. Vitni brings illustrated steps, parts information, and links to community support into the same guide experience."] },
      { id: "decisions", title: "Start with the guide library", paragraphs: ["I worked on making repair guides discoverable through search. A reader can begin with a concrete repair, then use the step-by-step detail to assess whether they have the right tools and confidence to proceed."] },
      { id: "implementation", title: "Make the steps easier to follow", paragraphs: ["My work covered richer repair steps, English and French site and guide support, and country-aware retailer links. The project is designed as a responsive, installable web app."] },
      { id: "evidence", title: "Explore the repair guides", paragraphs: ["The repair-app history records separate changes for illustrated guides, step detail, localization, and parts links. The public site puts those pieces together in the guide experience."], links: [{ href: "https://vitni.cc/", label: "Visit Vitni Repair" }] },
    ],
  },
  {
    project: { id: "vitni-credentials", title: "Vitni Credentials", status: "Credential platform project", media: [],
      summary: "An organization-first workspace for authoring, issuing, and verifying credentials.",
      contribution: "I worked on service-role mapping, deployment fixes, and operational documentation." },
    published: true,
    introduction: "A separate Vitni project for teams that need to issue and verify digital credentials.",
    team: "Vitni Credentials has its own implementation and data model.",
    sections: [
      { id: "problem", title: "Give organizations their own issuers", paragraphs: ["Credential tooling needs to reflect who issued each credential. The project models organizations as distinct issuers, each with its own identity, and puts authoring and delivery in an organization workspace."] },
      { id: "decisions", title: "Build around an organization boundary", paragraphs: ["The project uses a structured authoring workflow for badges and credentials. The workspace, API, and database are separate surfaces with different responsibilities."] },
      { id: "implementation", title: "Make deployment repeatable", paragraphs: ["My work included mapping service accounts to application roles, packaging shared brand tokens for deployment, and writing setup notes. Those changes helped define how the system is configured and operated."] },
      { id: "evidence", title: "Explore the credential platform", paragraphs: ["The public site gives the issuer-facing overview. The documentation walks through the platform’s credential workflow."], links: [{ href: "https://certificate.vitni.cc/", label: "Visit Vitni Credentials" }, { href: "https://docs.certificate.vitni.cc/", label: "Read the public Vitni documentation" }] },
    ],
  },
  {
    project: { id: "ambisonic-audio", title: "Ambisonic Audio", status: "Python experiment · 2018", media: [],
      summary: "A PyDub script that creates a moving stereo effect from existing audio.",
      contribution: "I wrote the Python script and documented the experiment." },
    published: true,
    introduction: "An early audio experiment in making movement audible through headphones using ordinary mono or stereo input.",
    team: "Personal Python experiment, with source code and a contemporaneous journal article.",
    sections: [
      { id: "problem", title: "Try a moving headphone mix", paragraphs: ["I wanted to see how far a simple script could push the impression of sound moving around a listener. The input could be a recording I already had."] },
      { id: "decisions", title: "Use stereo panning", paragraphs: ["PyDub made it practical to slice an audio file into short segments and adjust the left–right balance over time. The result is a stereo effect. A true Ambisonic recording and decoding chain is a different signal format."] },
      { id: "implementation", title: "Recombine the short segments", paragraphs: ["The implementation divides the source into roughly 200 ms segments, experiments with an inverted-phase overlay, applies changing pan values, and exports the assembled mix to MP3."] },
      { id: "evidence", title: "Code and original write-up", paragraphs: ["The source and journal post document the experiment from two angles: the script shows the processing, and the article explains what I was trying to hear."], links: [{ href: audio, label: "Read the Python source" }, { href: "/blog/2018-10-28-how-make-8d-ambisonic-audio-track-python", label: "Read the original journal article" }] },
    ],
  },
  {
    project: { id: "open-source-day", title: "Open Source Day", status: "Community contribution", media: [],
      summary: "The event website for the Schrödinger Hat open-source conference.",
      contribution: "I contributed website search, agenda updates, and the event gamification page." },
    published: true,
    introduction: "Helping attendees find the right information on a community conference website.",
    team: "Open Source Day is a collective Schrödinger Hat effort. This story covers my website contributions.",
    sections: [
      { id: "problem", title: "Make event information findable", paragraphs: ["As a conference site grows, the venue, agenda, and participation material accumulate across pages. Attendees need a way to find a specific topic without learning the whole site structure."] },
      { id: "decisions", title: "Make search available across the site", paragraphs: ["I contributed a shared search component across the website. Search provides a second route to event information alongside the main navigation."] },
      { id: "implementation", title: "Keep the event material current", paragraphs: ["My changes also included the 2025 agenda and the gamification page, covering both schedule information and an activity offered by the community."], links: [{ href: "https://github.com/Schroedinger-Hat/osday/pull/587", label: "Read the agenda pull request" }] },
      { id: "evidence", title: "Review the merged changes", paragraphs: ["The public pull requests record the scope of my work on search and participation."], links: [{ href: "https://github.com/Schroedinger-Hat/osday/pull/623", label: "Read the site search pull request" }, { href: "https://github.com/Schroedinger-Hat/osday/pull/598", label: "Read the gamification pull request" }] },
    ],
  },
  {
    project: { id: "browsir", title: "Browsir", status: "Open-source contribution", media: [],
      summary: "A command-line tool for opening browser profiles and website shortcuts.",
      contribution: "I contributed a GitHub Actions workflow for continuous integration." },
    published: true,
    introduction: "Adding repeatable repository checks to a community tool for managing browser profiles and shortcuts.",
    team: "Browsir is a Schrödinger Hat project. My recorded contribution focuses on CI.",
    sections: [
      { id: "problem", title: "Automate a repetitive local task", paragraphs: ["Browsir puts shared or local website shortcuts and multiple browser profiles behind a command. The repository documents which browsers and platforms it supports."] },
      { id: "decisions", title: "Keep verification alongside the code", paragraphs: ["A repository workflow gives contributors a shared place to run checks as changes arrive. I worked on that integration as a contribution to the project."] },
      { id: "implementation", title: "Add GitHub Actions CI", paragraphs: ["The contribution adds continuous integration through GitHub Actions. The merged pull request provides the concrete scope of that change."] },
      { id: "evidence", title: "Repository and workflow", paragraphs: ["The project README describes the CLI and its configuration. My pull request records the CI contribution."], links: [{ href: "https://github.com/Schroedinger-Hat/browsir", label: "Explore the Browsir CLI" }, { href: "https://github.com/Schroedinger-Hat/browsir/pull/34", label: "Read the CI pull request" }] },
    ],
  },
  {
    project: { id: "open-source-wrapped", title: "Open Source Wrapped", status: "Community project", media: [],
      summary: "A year-in-review experience for open-source activity on GitHub.",
      contribution: "I contributed the 2023 refresh, GitHub username handling, and improvements to sharing controls." },
    published: true,
    introduction: "A community project that turns GitHub activity into a sequence of personal year-in-review slides.",
    team: "Open Source Wrapped was built by the Schrödinger Hat community.",
    sections: [
      { id: "problem", title: "Look back at a year of contributions", paragraphs: ["GitHub activity is spread across repositories and dates. A short visual recap gives people a way to revisit and share part of what they contributed."] },
      { id: "decisions", title: "Present a sequence of slides", paragraphs: ["The project uses a year-in-review format to present activity as a small sequence. The repository documents its GitHub integration and setup."] },
      { id: "implementation", title: "Refresh the experience for 2023", paragraphs: ["I worked on the 2023 refresh, GitHub API username handling, and social buttons. My changes covered both the presentation and part of the GitHub integration."], links: [{ href: `${wrapped}/commit/f7642044488c03062348f5e09f76d79f44deb6cc`, label: "See the 2023 refresh commit" }] },
      { id: "evidence", title: "Read the community source", paragraphs: ["The repository contains the application and setup instructions. The commit history preserves the specific work behind the refresh."], links: [{ href: wrapped, label: "Explore Open Source Wrapped" }] },
    ],
  },
  {
    project: { id: "youtube-to-anchorfm", title: "YouTube to Anchor.fm", status: "Open-source automation", media: [],
      summary: "A GitHub Action built to help turn YouTube episodes into podcast uploads.",
      contribution: "I worked on releases and documentation and merged contributor fixes to the publishing workflow." },
    published: true,
    introduction: "A community automation project that grew out of publishing the Schrödinger Hat show in two formats.",
    team: "Built with the Schrödinger Hat community and public contributors.",
    sections: [
      { id: "problem", title: "Publish an episode in two places", paragraphs: ["The live show already had a video episode. Preparing a second version for podcast listeners created a recurring publishing task for the team."] },
      { id: "decisions", title: "Package the workflow as an action", paragraphs: ["The team packaged the workflow as a GitHub Action, so a repository could run it as part of its publishing process. The integration was built around Anchor.fm as it existed at the time."] },
      { id: "implementation", title: "Maintain the shared integration", paragraphs: ["My work included release and documentation changes and merging contributed fixes. The public history records changes to Spotify login and action error handling from collaborators."], links: [{ href: `${podcast}/commit/601d281daadd2c210649aed350520a58cfad35eb`, label: "See the version 2.5.0 release commit" }] },
      { id: "evidence", title: "Read the original workflow", paragraphs: ["The project README documents the original use case and configuration. Provider changes can affect whether the historic integration still runs today."], links: [{ href: podcast, label: "Explore the action on GitHub" }, { href: "https://github.com/sdras/awesome-actions/pull/482", label: "Read my Awesome Actions submission" }] },
    ],
  },
] satisfies readonly CaseStudy[];
