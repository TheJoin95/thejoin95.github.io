---
title: "Ambisonic audio generator — Audio in 3D"
description: "An experiment with PyDub to simulate surround sound from a standard MP3 track."
date: 2020-01-03
language: en
tags: ["audio", "python", "developer", "programming"]
---

Did you ever listen to an ambisonic audio file?

[A sample of an ambisonic audio track](https://www.youtube.com/watch?v=vUtEW6OTQLw)

## What is an Ambisonic audio?

It is a full-sphere surround sound format audio track that reproduce (or simulate) a 360deg source (x, y, z) with a lot of sounds mixed up in a lot of different channels, that comes from different angle. The following image will explain it better, with a graphical solution:

<figure><img src="/media/journal/medium/ambisonic-recording.webp" alt="Diagram showing two differently positioned microphones, marked red and blue" width="512" height="512" loading="lazy"><figcaption>A simulation of what is an ambionic recording audio graph. Red and blue are two different mic, positioned in two different way</figcaption></figure>

[View the original animation](https://miro.medium.com/v2/resize:fit:1024/1*1K4HKN1sm-5-o3YBVR6J-Q.gif).

On youtube you can find a lot of ambisonic video and a lot of music.\
Also, some songs, may sound even better with this method! Give it a try!

So, I started to ask me: how I can convert a simple audio track (eg. Mp3) to a similar or look like Ambisonic/3D audio? Here we go:

[TheJoin95/ambisonics-3d-audio](https://github.com/TheJoin95/ambisonics-3d-audio)

> note: this will not make a real ambisonic audio, but a simulated one

I made this simple repository to rearrange a mp3 audio file to simulate a surround sound sphere.

Thanks to PyDub I can manage to add some channels, revert the phase and update it by following a 360deg form, gave me from a simple formula (cos and sin).

The idea is still simple, as the python code, but it worked pretty well.\
I’m also trying to implement some kind of effects that will make the generated audio file more deep and mystic.

If you like the idea, feel free to contribute!

Cheers!

See also [How to make a 8D audio track with Python](/blog/2018-10-28-how-make-8d-ambisonic-audio-track-python).

*Originally published on [Medium](https://thejoin95.medium.com/ambisonic-audio-generator-audio-in-3d-3f649c7669ab).*
