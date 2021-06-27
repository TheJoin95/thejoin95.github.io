---
title: The Sorting Hat Experiment | WebAR in pure JS
description: The power of AR in the palm of a hand Google, with Chrome, is trying to develop and guarantee support for AR and VR by proposing a standard at the level of W3C. The proposals are still in draft and in the proposal phase, but there are already some experiments that can be tried.
permalink: sorting-hat-experiment-webar-in-js
icon: Qqsgit1tyWw
date: 2020-02-23
category: javascript
tags: [javascript]
---


# The Sorting Hat Experiment | WebAR in pure JS

<div class="mx-auto">
    <img class="max-w-full" src="https://source.unsplash.com/Qqsgit1tyWw/960x680" />
</div>

The power of [augmented reality](https://arvrjourney.com/) in the palm of a hand: Google, with Chrome, is trying to develop and guarantee support for AR and VR by proposing a standard at the level of W3C. The proposals are still in draft and in the proposal phase, but there are already some experiments that can be tried.

## How to implement an experience in AR

There are many applications and experiments with AR technology, while there are few experiments with the same technology directly on the web.

Despite the investments of many Big Companies on this technology, there is still no real standard for their realization.

For the native, there are various libraries, tools and frameworks. Google has developed ARCore, which can be implemented on both iOS and Android, while Apple has developed ArKit which however can only be released on iOS.

If we stop to reflect, the current lingua franca is javascript. The current environment, which everyone has, is the web. It is true, there is no guarantee of performance, due to the large scale of devices that have access to it.

However, we can still achieve excellent results.

## The WebGL experiment

![](https://cdn-images-1.medium.com/max/2000/1*M3a3KWEdil5yJxxSkhxssA.png)

About two years ago I implemented a small experiment in WebGL to extend the reality and, in fact, carry out an AR experiment: to implement the talking hat of the famous Harry Potter saga, to sort the various users in the various Hogwarts houses.

You can see the full project by clicking on the [Sorting Hat Experiment](https://github.com/TheJoin95/sorting-hat-experiment-webgl) repo link.

The result can be visited [here](https://experiments.thejoin.tech/) (self- signed certificate).

## Technologies used for the experiment

The experiment was implemented in pure javascript, using the [Three.js](https://threejs.org/) library , the native API to retrieve the camera and accelerometer input and making use of the [https://trackingjs.com/](https://trackingjs.com/) library for facial recognition (via a MobileNet ).

At the time of the experiment, there was still no google project to implement the WebXR API (API to implement the native web AR) in Chrome, nor the version of Three.js, oriented towards the management of a 3D environment in [VR](https://arvrjourney.com/), AR-oriented: [Three.ar.js](https://github.com/google-ar/three.ar.js) .

## How the experiment was implemented

The implementation was simple, as the only inputs are the camera of the device (pc or smartphone) and the input of the questionnaire taken from the Pottermore site (a reference site for the Harry Potter saga).

The critical issues are related to the support of a wide range of devices. The experiment, not using libraries optimized for [AR](https://arvrjourney.com/), suffers from *fps lag, *on older devices with CPU and GPU not of medium / high range.

![Example of face recognition in web app](https://cdn-images-1.medium.com/max/2000/1*ThaRgxpoSZyj58F-f20Iww.png)*Example of face recognition in web app*

The greatest optimization, to try to solve this problem, was done in rendering the 3D model of the sorting hat based on facial recognition.

This process brings a big charge at the CPU and GPU level, since on each tick he has to update the whole canvas (our AR level) and reposition the hat.

The main optimization was to carry out the facial reconnaissance process only every tot of frames per second, in this way it is possible to guarantee a smooth experience without weighing down the less performing device, effectively levelling all the other higher-end devices. .

At the start of the quiz, audio files were loaded and played in sequence, based on the choices of the questionnaire, which replicated the scenes of the film and the indecision of the hat.

At the end of the quiz, the sorting hat decreed the house of belonging and exclaimed its name.

## Conclusion

An experiment of this kind, brought to a more professional level, with the right tools and with more resources, could certainly be useful to JK Rowling in the boom of the saga to further retain the various users.
