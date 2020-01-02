---
layout: post
title: How to make a 8D audio track with Python
description: Learn how to make a mono/stereo audio track to 8D Ambisonic audio track
permalink: how-make-8d-ambisonic-audio-track-python.html
icon: music
date: 2018-10-28
category: python
tags: [python]
---

Did you ever listen to an 8D song? Or Ambisonic audio track?
I'll suggest you to take your headphone, 5min of your time, and search "8d song" on youtube. Enjoy.

It's sound amazing.

So... I wanted to figure out if it was possibile to recreate the 8D effects with any audio sources.
The response: yes.

For this little project I choose Python with the PyDub library.
I made a simple script right here: https://github.com/TheJoin95/ambisonics-3d-audio
Check it out, clone it and try it.

## How it works?
An Ambisonic track is totally a different track from a mp3 file or a video.
It need to be recored by a special microphone, with at least 4channels.
To reproduce the Ambisonic track you need to have multiple speaker (like a 5.1 and more).

My goal is to make every single audio track an ambisonic track or, at least, make a 360/3D effects audio.
We can recreate the 3D effects by using some effects (pass filter low|high) and panning the audio from the left earphone to the right side and viceversa.

Of course, you can try to mix the audio track by invert the phase and overlap the track. This can guarantee you a good quality result.

I'll suggest you to try the script on github with your favorite track.

## Editing the script
You can edit the init.py file with your mp3 file to convert, e.g.

{% highlight python %}
interval = 0.2 * 1000 # sec
song = AudioSegment.from_mp3('mp3/castle-of-glass.mp3')
{% endhighlight %}

then you can run the init.py script. The result (a mp3 file) will be produced in a compiled folder.

Enjoy your 8D track.
