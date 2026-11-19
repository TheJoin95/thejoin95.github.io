---
title: "Use Conventional Commit Messages to Improve Team Communication"
description: "How Conventional Commits and the wdyd CLI help teams write consistent, descriptive commit messages."
date: 2022-08-03
language: en
tags: ["software-engineering", "clean-code", "software-development", "programming"]
---

<em>With wdyd and other platforms</em>

<figure><img src="/media/journal/medium/conventional-commits-cover.webp" alt="An outstretched hand beneath a floating light bulb" width="1024" height="1536" loading="lazy"><figcaption>Photo by <a href="https://unsplash.com/@juniorferreir_">Júnior Ferreira</a> on <a href="https://unsplash.com">Unsplash</a></figcaption></figure>

Sometimes, when working in a team or open source organization, you may misspell a message or make errors in your repository's commits. These errors can spread through the code base of a huge product or tech stack.

To me, it’s really important to be fully transparent on the coding side and to be communicative and descriptive in developing a project, a product, or even a utility tool written by devs for devs.

In this article, we are going to talk about conventional commits, what is important, and how to write a good commit message to have full control over your code base.

I’ve created a simple project to help new developers/students approach the Conventional Commits in their own or professional projects.

## What Are Conventional Commits?

It’s a specification to have a readable human commit message. It provides an easy set of rules for creating an explicit commit history by declaring a scope, relating an issue/story/bug, and adding some keywords in the subject/message or footer of your commits.

Here’s an example of a commit message with a description and breaking change footer:

> feat: allow provided config object to extend other configs

## Why Should You Implement the Conventional Commits Rules?

Being more descriptive in coding will give you the following advantages:

- You can automatically generate great changelogs on your projects and semantically determine the version bump
- It will be easier to determine the nature of the changes to the teams by using some fundamental keywords (feat, chore, revert, etc.…)
- By using hashtags, you can trigger workflow process (such as closing issues or stories)
- Make it easier for third-party people to join the team, so they can start contributing after a low onboarding effort

## How Wdyd Works

The npm package, wdyd, was created as a support and utility tool in order to try out the conventional commits standard and implement it in your projects. It is also more friendly for newbie people in the software development industry.

The node script replicates and formats the message by taking in valuable user input. It has two modes: manual and interactive.

To get started, you need to install the package globally by using the following command:

> npm i -g wdyd

## Interactive Mode

By using the inquirer package, the user will be prompted with a couple of questions about the nature of its changes, and by choosing the type, the utility will create a commit message with you step by step. It would be easy for someone to approach this kind of message for the first time using the interactive mode.

The questions will be:

- Select the one that fits your changes. What did you do? (mandatory)
- What scope did you focus on? (mandatory)
- Describe your change in an imperative way (mandatory)
- Include the motivation for the change and contrast this with previous behavior
- Type The footer should contain any information about Breaking Changes and is also the place to reference GitHub issues this commit closes

<figure><img src="/media/journal/medium/wdyd-interactive.webp" alt="The wdyd interactive prompt listing commit types and describing when to choose each one" width="1024" height="204" loading="lazy"></figure>

## Manual Mode

Is for more mid/senior level developers (yes, no one should stop from learning). In this case, you can run <em>wdyd -h</em> to get all the info about the commands you can run. In the following image, you can see the list of possible commands you can run:

<figure><img src="/media/journal/medium/wdyd-command-list.webp" alt="wdyd help output listing options and commands for each supported commit type" width="1024" height="454" loading="lazy"></figure>

You can run the following:

> wdyd e2e ‘signin page tests’ ‘Following the #34 issue on testing, we are now covering 93% of the code’

To commit an e2e implementation over your sign-in page that links the #34 issue.

## How to Write a Good Commit Message

You can have the full specification on the [conventional commits website](https://www.conventionalcommits.org/en/v1.0.0/), but here are some important tips to keep in mind when writing a commit message.

Any commit must have a prefixed type, such as feat, fix, or chore, to identify the context of the changes. If you are introducing a breaking change in your code base, you need to specify a ! right after the type.

A scope, inside the parenthesis right after the prefixed word, should be inserted when we have a short message or a project scope related to all the changes made in the commits, such as: feat(signin) or fix(product-page).

A mandatory part when we are composing our message is the description. It should be more descriptive, imperative, and not too long. Drop just a line, like:

> <em>fix: object parsing issue when passing nullable values</em>

A longer commit body may be provided after the short description, providing additional contextual information about the code changes, such as:

> The page was giving a fatal error and blocked the user navigation flow. Now, we’re logging the error and not blocking the user flow anymore.

If anything inside your commits is a breaking change, such as a deprecation or a deps change, it’s good to write it down as a footer of our commit message. Using BREAKING-CHANGE will help highlight the thing we’ve changed. For example:

> BREAKING CHANGE: non nullable values are now throwing just a warning message and not a fatal error.

So, for example, our commit message should be composed like this:

> fix!(product-page): object parsing issue when passing nullable values

> The page was giving back a fatal error and blocked the user navigation flow. Now we’re logging the error and no more blocking the user flow.

> <em>BREAKING CHANGE: non nullable values are now throwing just a warning message and not a fatal error.</em>

## Conclusion

When working in a team or collaborating with others, it is always good to have guidelines or rules in our code and especially in our code base for better communication.

Conventional commits is embraced by a lot of people and companies. This tool is a simple implementation to help other devs or people to understand the logic behind and improve their team’s communication.

*Originally published in [Better Programming](https://medium.com/better-programming/use-conventional-commit-messages-to-improve-team-communication-4c7d9cc8f939).*
