---
title: "Optimize the User Experience and Performance via Node.js and Lighthouse"
description: "How we used Puppeteer, Lighthouse, Prometheus, and Grafana to measure UX and performance after each build."
date: 2022-08-17
language: en
tags: ["javascript", "nodejs", "web-development", "automation", "programming"]
---

<em>Tips to improve both at the same time</em>

<figure><img src="/media/journal/medium/performance-cover.webp" alt="Runner wearing number 10 on a track" width="692" height="648" loading="lazy"><figcaption>Photo by <a href="https://unsplash.com/@nhoizey">Nicolas Hoizey</a> on <a href="https://unsplash.com">Unsplash</a> | image height altered</figcaption></figure>

> Just think about it: why should you concentrate your energy in optimizing the user interface and the user experience of your application instead of focusing on the performance side of the whole thing?

I believe that UX/UI improvement can lead to better performance. The product lead and tech people are the ones that will enjoy the benefits.

Recently, I implemented an automatic post-build pipeline to automate visual and performance testing through Lighthouse. We were collecting metrics, screenshots, testing, and performance results, and after manually analyzing those, we were achieving some changes, some UX improvement, some features removals, and so on.

We achieved a lot of improvements and a good historical chart over the Grafana Dashboard of any kind of release in our frontends code base (we are using a micro frontend architecture).

Let’s dive into it these improvements.

## What Is the Scenario?

I worked for a popular Italian email marketing platform that is a top-quality multichannel cloud platform used by more than 10,000 customers to improve their email and SMS marketing strategies.

We were working to give the best experience to the end user by improving the performance, the user interface, and the user experience.

The platform has many features and pages used daily, and because of this, every release counted. We were working on a micro frontend architecture and delivered more than 30 releases per project per week.

Apart from e2e, a/b testing, stress test, etc., we wanted to monitor every frontend release to check if we made an improvement on the UI/UX or the client-side performance.

## Which Is the Best Solution for Our Case?

We thought a lot and proposed many hypothetical solutions with pros/cons. We finally ended up with a custom implementation in our Jenkins pipelines of Lighthouse, using Node.js, Puppeteer, Prometheus, and Grafana.

We were using Lighthouse metrics to monitor the new development, porting tasks, UI/UX improvements, performance, and so on.

By collecting those metrics, we could also have historical data to compare the “old” and the “new” via Prometheus and Grafana. Of course, everything should be portable, so we used Docker under the hood to be portable and deploy everything on our cloud provider (AWS).

## What Technologies Were Used?

All the proposed technologies were open source libraries. Here’s what we used:

Puppeteer — a node library that provides a high-level API to control Chrome or Chromium over the DevTools Protocol. So, you have a Chromium instance running in the background with full control!

<figure><img src="/media/journal/medium/puppeteer-chrome.webp" alt="Chrome launched in a test window and marked as controlled by automated test software" width="1024" height="622" loading="lazy"></figure>

Prometheus — an open source system for data modeling and time series DB. We used this as data provider for Grafana.

Grafana — an open source analytics and monitoring solution. It permits you to build your dashboard and boost the observability of your apps.

Lighthouse — an open source, automated tool for improving the quality of web pages made by Google. Its architecture is built around Chrome Debugging Protocol which is a set of low-level APIs to interact with a Chrome instance. It interfaces with a Chrome instance.

The Audits came from the new modern web standards such as First Contentful Paint on page, render time, etc. You can find more on [https://web.dev/measure/](https://web.dev/measure/).

<figure><img src="/media/journal/medium/lighthouse-architecture.webp" alt="Lighthouse architecture diagram showing how gatherers, audits and report generation connect" width="590" height="408" loading="lazy"></figure>

We chose open source projects because we truly believed in open source. Our project will soon be available on an open source repository.

## How We Implemented the Solution

We tried a lot of different architecture and implementations, and we ended up doing the following:

- building our solution on a node instance
- executing a web server for our APIs within a headless browser (puppeteer) running in the background
- getting the Lighthouse metrics
- writing the metrics on S3/disk
- collecting them via Prometheus so we could finally retrieve it from Grafana

Here is our architecture schema:

<figure><img src="/media/journal/medium/performance-pipeline.webp" alt="Pipeline diagram showing Node.js, Puppeteer and Lighthouse writing audit results to disk for Prometheus and Grafana" width="751" height="669" loading="lazy"></figure>

Our node instance served our endpoint to collect the metrics from our Jenkins pipeline via the cURL bash command.

The API executed the lighthouse test on the URL passed as a parameter in the request so we could redirect our browser (via a puppeteer instance) to the correct page.

Of course, our platform had a form authentication, so we needed to authenticate to our demo platforms in the first place. To give you an example of the solution, I will show you a snippet of our authentication flow through puppeteer and Node.js.

As we used Puppeteer, we reproduced any kind of actions of a real user. So we would click on the button, type in the inputs, and move the mouse to a direction on the page to simulate the users’ actions.

In the following snippets of code, you can see how we implemented the signIn function and how the puppeteer API worked:

*The original sign-in code embed is unavailable. See the [Puppeteer API reference](https://pptr.dev/api) for the browser automation methods.*

## What Are the Results of This Project?

We managed to build our solution and attach our automation to every micro frontend application via a post-build trigger in Jenkins. This would trigger an API for collecting metrics for any page or feature.

Here is an image from our local dashboard retrieving a page metrics, its score, times, audits, and so on:

<figure><img src="/media/journal/medium/performance-dashboard.webp" alt="Grafana dashboard with gauges and audit results for performance, accessibility and SEO" width="1024" height="445" loading="lazy"></figure>

By using this tool, we permitted the product and design team to control their customer journey and user flow / UX performance. We enabled the tech team to understand whenever there was an issue in a specific release or a big improvement in terms of performance.

> Funny story: we changed the way a CDN was caching and delivering the assets and we managed to see the change in our metrics thanks to Grafana historical charts.

## Takeaways

- We believe that Lighthouse is a great tool for analyzing and monitoring our applications.
- The biggest challenge was implementing the platform’s authentication and business logic inside a container, but we made it!
- Collecting metrics on pre- and post-release has allowed us to be more aware of our goal, and it allows us to have a big picture of the whole application design to improve the UX
- Improving the product development process

> My final tip is to always try to improve and automate everything!

*Originally published in [Better Programming](https://medium.com/better-programming/optimize-the-user-experience-and-performance-via-node-js-and-lighthouse-bfd8107fe248).*
