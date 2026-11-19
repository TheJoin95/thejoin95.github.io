---
title: "Upgrading to React18 is easy"
description: "How we upgraded React 16 micro frontends to React 18 alongside Recoil and Testing Library."
date: 2022-09-20
language: en
tags: ["micro-frontends", "npm", "webpack", "tech", "react"]
---

<figure><img src="/media/journal/medium/growens-react18-cover.webp" alt="Upgrading to React18 is easy, Tech innovation, with an illustration by unDraw" width="1024" height="644" loading="lazy"></figure>

We read that a lot of people and companies are having issues with the migration from a previous version of React library to the latest version, the React18, and we thought it would be hard to <strong>upgrade our micro frontend applications</strong> from React16 to React18, with RecoilJS and all the tests.

<em>It turns out that no, it was not that hard, actually </em><strong><em>it was pretty easy</em></strong><em>!</em>

We did it fast, without breaking anything, migrating the whole application to the latest react, recoil and testing library version without experiencing any issues.

<em>In this article we are going to analyze the actions that we took in order to </em><strong><em>get an easy migration</em></strong><em> to a newer version of the library.</em>

## What’s really new in React18?

React-dom API is changed, this is the fastest answer to the question.

This article is <strong>not meant to be an in-depth journey</strong> into React18, because a lot of things were limited or deprecated before this version came out, and the other features provided just small changes (such as renderToPipeableStream or useEffect or StrictMode).

Of course, we are reflecting all of these changes from our point of view (react16 codebase), where we are already using <em>functional components </em>for an easier usage of the hooks such as useEffects.

## Migrating to React18 in few easy steps

<em>Again, this is our personal experience, it might be different for others or in other environments.</em>

First of all we needed to <strong>clean all the old dependencies</strong> and check for security issues for the others via npm audits. It’s always about the node modules.

After this “pre-hook”, we verified the official [React changelogs](https://reactjs.org/blog/2022/03/29/react-v18.html), then <strong>upgraded the React package</strong> and started to get the errors we planned to see, such as the ReactDom package that changed its API:

<figure><img src="/media/journal/medium/react18-browser-warning.webp" alt="Browser console warning that ReactDOM.render is unsupported in React 18 and recommends createRoot" width="988" height="166" loading="lazy"></figure>

Even in the test env as it follow:

<figure><img src="/media/journal/medium/react18-test-warning.webp" alt="Test console warning that ReactDOM.render is unsupported in React 18 and recommends createRoot" width="994" height="258" loading="lazy"></figure>

By analyzing these errors we changed the deprecated render method and also updated the testing-library/react in order to still get unit test run successfully.

Since we were already using functional components, the useEffects minor changes didn’t affect us, but we added the newest StrictMode to verify that (it’s available only in dev mode).

Another major change in this React version is related to the Suspense usage and its tree, that is now always consistent. We were not experiencing any issues.

Lastly, we needed to <strong>upgrade RecoilJS</strong> to the latest version in order to support the latest React version, otherwise the App would crash as soon as it got the first state.

And here it was, <strong>our migration was complete</strong>.

We needed to upgrade these few things to get our migration process done for all our micro frontends applications.

This process was made easy by our foresight in bringing the latest version of the packages that we were using, <strong>without any fear</strong> under any respect, e.g. time, effort or boring stuff that needed to be done.

## Takeaways: always manage to upgrade your dependencies and approaches

As I said, we were migrating from a codebase in React16.

<em>How many of you are updating their dependencies any time a new major version is released?</em>

A good way to reduce the effort and hard times during migration is to <strong>schedule an “upgrade task”</strong> during the sprint as a tiny workload, in order to avoid a bulk upgrade that may lead into a huge waste of time.

Of course, we need time to make the updates but it’s more under control to update a few things instead of a full codebase.

<em>“Yeah, ok, but my manager/PM does not let me schedule these maintenance tasks!”</em>

Unfortunately, I heard a lot of people experiencing this issue. <strong>Speak to your manager</strong> in order to let him/her understand the importance of being up to date with your tech stack, also for security reasons.

<em>“I hate upgrading or auditing my dependencies, it’s boring and very hard to accomplish!”</em>

This feeling should not exist in a good environment.

Sure, it’s not fun to audit and update dependencies, but it’s part of our job and our responsibilities.

<em>Be a better developer, upgrade your deps.</em>

See also the [Better Programming edition](/blog/2022-08-15-upgrading-to-react-18-isnt-that-hard).

*Originally published in [Growens Innovation Blog](https://medium.com/growens-innovation-blog/upgrading-to-react18-is-easy-f4c41b0b74a1).*
