---
layout: post
title: Ionic - Build ios app without a mac... VM!
description: If you don't have a macbook or a mac you can build your ionic app with virtual machine!
permalink: ionic-build-ios-app-without-mac-virtual-machine.html
icon: mobile
date: 2017-12-09
category: ionic
tags: [ionic, ios, build]
---

Yep... same problem here! But I've got a solution!
If you don't have a mac to build your app, and if you don't want to buy it... you can follow these guide.
I will use Virtual Machine and vagrant.

## What we need?
- [Vagrant](https://www.vagrantup.com/)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [VirtualBox Extentions Pack](https://www.virtualbox.org/wiki/Downloads)

After you have install it, we can search on vagrant for a good image of mac os.
In this guide, I will use a Mac Os Sierra image, because I need at least XCode 9.

**NOTE: you can search whatever you want on vagrant, just make sure the image is updated.**

## Install Mac Os by vagrant

We will use this vagrant image: [jhcook/macos-sierra](https://app.vagrantup.com/jhcook/boxes/macos-sierra).

All you need to do is to make a dir and then type:

{% highlight bash %}
vagrant init jhcook/macos-sierra; vagrant up
{% endhighlight %}

This will initialize a vagrant instance in Virtual Box and the it will try to run it.


**NOTE: Mac Os Sierra is 13GB. Take a break or a night out.**


## After the installation
So, now you have a vagrant instance running.
You can connect to the system trough a vagrant ssh (127.0.0.1) or... just open the VM on VirtualBox.

The username and the password are the default for vagrant: 
- user: vagrant
- psw: vagrant

After the installation you need to install what you need, for example, XCode or GIT or Ionic.
Yeah, it is a low budget solution, but it works.

You can build your app and submit it to the Apple Store.
Make sure (ALWAYS) to save your virtual machine state, otherwise you need to redo what you already do before.

Cheers.


P.S. Apple approve the virtualization of their O.S.