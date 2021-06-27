---
title: Netflix cover generator — A NuxtJS project
description: An easy to use tool for generating high definition Netflix Show Image for A/B testing or Youtube cover image
permalink: netflix-conver-generator-nuxtjs-konvajs
icon: jtmwD4i4v1U
date: 2021-02-22
category: javascript
tags: [javascript]
---


# Netflix cover generator - A NuxtJS project

<div class="mx-auto">
    <img class="max-w-full" src="https://source.unsplash.com/jtmwD4i4v1U/960x680" />
</div>

Photo by Charles Deluvio on Unsplash

## The context

For our podcast there was a need to speed up the YouTube cover creation process. The cover must be interesting, containing the right information and in the right format.

In [Schrodinger Hat](https://www.schrodinger-hat.it/) we only have one graphic designer, Francesca. For this reason we always try to overload it with requests, so as to automate the process as much as possible.

## Why Netflix Cover Generator?

Well, if you don’t learn from the best who should you learn from?

We really like the covers of the various TV series and movies in the Netflix catalog. The inspiration comes from their platform. The style clearly refers to that of Netflix albeit with a few changes and less details.

We took as a reference the example of the Netflix title, a testing page dedicated to positioning and footprint.

## What is the project really about?

The project is a small application that makes a drag-n-drop editor so as to insert images and edit texts and clutter. It’s fully customizable and doesn’t require too many skills to tweak.

The codebase is [Nuxt.js](https://nuxtjs.org/) (VueJS framework) and [KonvaJS](https://konvajs.org/), a JS library for HTML5 canvas interpolation.

The repository is available on our [Github](https://github.com/Schrodinger-Hat/netflix-show-generator).

The demo is available on our [demo website](https://netflix.schrodinger-hat.it/).

## How does it work?

Using Konva.JS we initialize a Canvas containing multiple layers, just like a Photoshop project. Each layer encloses a portion of the rendering:

* background and photos

* shade

* headings and text

* additional layer for additional photos / texts

It is thanks to this structure that it is possible to have a game of effects, such as the gradient in Netflix style.

Nuxt handles the KonvaJS API very well and this makes development and implementation of features easy and extremely fast.

The Canvas element also offers a very important property such as pixelRatio.
This property allows us to export and save our work in high resolution for subsequent modifications or to work with particular formats.

In this way the project can solve many problems.
Obviously everything could be improved, starting from the colors that could be selectable and customizable directly during the creation of a “project”.

We decided to leave it like this, as if it were a PoC, precisely because it could have interesting implications and because it is our favorite theme.

## How can I get it to work locally?

The project is portable and can be released anywhere. We have chosen Netlify.
Locally it will be enough to clone the repository from the link above, install the npm modules and start the dev server via Nuxt.

In README.md you will find all the instructions :)

## Future implications or future implementations?

We currently use it internally for the production of our podcast YouTube covers, but we do not hide that it could become something else in the future.

We would like to create a kind of tool to speed up UI / UX testing by simply having the various components in Vue / React / * JS so as to try to render them on a canvas (a bit like if we were making a microfrontend) and verify that it is all correct in terms of design.

## Conclusion

The project was a lot of fun to do. KonvaJS is very intuitive and the API Reference was really useful. Downloading the YouTube cover in high resolution from this tool saved us a lot of time for each uploaded video!

Our YouTube channel is: [https://www.youtube.com/channel/UC1QLLgrGrPmlaFhS0orykCA](https://www.youtube.com/channel/UC1QLLgrGrPmlaFhS0orykCA)

The podcast is only available in Italian.
