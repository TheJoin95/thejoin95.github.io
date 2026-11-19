---
title: "Automate the Publishing Process of Your Podcast With GitHub Actions"
description: "A GitHub Actions workflow for turning a YouTube upload into a podcast episode on Anchor.fm."
date: 2020-08-30
language: en
tags: ["automation", "javascript", "github-actions", "programming", "podcast"]
---

<em>Send your podcast from YouTube to Anchor.fm</em>

<figure><img src="/media/journal/medium/youtube-to-anchor.webp" alt="YouTube logo with an arrow pointing to the Anchor logo" width="1024" height="480" loading="lazy"><figcaption>The repository cover image</figcaption></figure>

## The Context

During the quarantine period, I started an Italian tech live show on YouTube and a podcast on Spotify and Anchor.fm with some of my friends. The show is called Schrödinger Hat.

We are enjoying creating this content on the web, but we have encountered some technical issues. Some of them were minor issues that we managed easily during the time, but then there was the major issue.

## The Issue

We encountered some problems by uploading the audio file from YouTube to Anchor.fm, because this action required time, a conversion tool, and you know, in 2020 no one has too much time.

We started thinking. We searched for some Anchor.fm APIs, but found none, until this conversation happened:

> “Should we create a private Anchor.fm API?”

> “Uhm, I heard something about Github Actions, maybe we can automate the whole process by using it”

> “Shut up and let’s start coding.”

## The Solution

We are managing the whole podcast project trough Github and with the Github Actions, you can automate, customize, and execute your software development workflows right in your repository.

We developed a Github Action, available on the [Github Action Marketplace,](https://github.com/marketplace/actions/upload-episode-from-youtube-to-anchor-fm) that automates the whole publishing process from YouTube to Anchor.fm.

[Schrodinger-Hat/youtube-to-anchorfm](https://github.com/Schrodinger-Hat/youtube-to-anchorfm)

The workflow and the action are available for free, it is open source under MIT license.

## How It Works

The Github Action is using youtube-dl library and puppeteer. The first one is an npm module used for downloading the video/audio from YouTube, meanwhile Puppeteer will upload the generated file into the Anchor.fm dashboard (by logging into it).

The action will start every time you push a change on the episode.json file. You need to specify the Youtube ID of your video. The action uses a Docker image built over ubuntu 18.04. It takes some time to set up the environment (installing dependencies and chromium-browser).

## How Can I Use It?

You can use the latest version of this action from the [Github Action Marketplace](https://github.com/marketplace/actions/upload-episode-from-youtube-to-anchor-fm). In your repository root directory, you should add a episode.json file containing your Youtube video ID, e.g:

```json
{
  "id": "nHCXZC2InAA"
}
```

Then you can add under the .github/workflows directory for this YAML file:

[View the workflow YAML in the project documentation](https://github.com/Schrodinger-Hat/youtube-to-anchorfm#usage).

<strong>NOTE</strong>: You need to set up the secrets for <em>ANCHOR_EMAIL</em> and <em>ANCHOR_PASSWORD</em>. These environment variables are mandatory as they specify the sign-in account.

## <em>A Little Workflow Explanation</em>

The above workflow is saying: “Every time you push some changes on the episode.json file, it will setup the “YouTube to Anchor.fm” action with your Anchor.fm account (specify in your secrets) that will download the YouTube video specified, convert it into an audio file (best quality) and upload it into your Anchor.fm account

## Conclusion

We enjoyed building this action on Github Actions and it saves us a ton of time. We are hoping that this will help other creators that are using the same platform. I would suggest that Anchor.fm make some public API to permit developers to push the audio file and managing the whole publishing process better.

*Originally published in [Better Programming](https://medium.com/better-programming/youtube-to-anchor-fm-a-github-action-to-automate-the-publishing-process-of-your-podcast-1dbb0fc90560).*
