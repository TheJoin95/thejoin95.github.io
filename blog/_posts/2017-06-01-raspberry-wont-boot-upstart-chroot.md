---
layout: post
title: Raspberry won't boot - Recover data and fix bug with chroot [ubuntu]
description: If raspberry won't boot and it's caused after you installed upstart, you can use chroot for make backup or fix the whole image
permalink: raspberry-wont-boot-make-backup-with-chroot-shell.html
icon: cog fa-spin
date: 2017-06-01
category: bug
tags: [raspberry, boot, backup]
---

Two weeks ago I installed on my raspberry (raspbian wheezy) upstart package (an ubuntu package for process management)... and it was an error.

Yeah, because raspbian has systemd and you don't need to install upstart!! Don't do that!
It's a little bit strange that, after installed the package, raspberry was still going.

For an unlucky event at my house the current was gone. So, the raspberry was (suddendly) powered off.
Then it won't boot anymore.

The error show up at the boot screen was related to "semlinux" and it can't mount the partition.
{% highlight bash %}
Mount failed for selinuxfs on /sys/fs/selinux: No such file or directory
{% endhighlight %}

## How you can resolve this? 

There were 3 choice:
- Backup or copy the whole root partition to a new sd card
- edit cmdline.txt adding init=/bin/bash (called single-user mode or recovery mode)
- fix the issue via chroot

### Backup
Yeah, I know.. we usually have a backup (don't you?)... but it was not my case! :(

### Single-user mode

So I tried to add init=/bin/bash to cmdline.txt file present in the boot partition.

At the startup the boot stop and, after you hit enter, you can access to the root shell.

Here you can mount all the partitions and use, almost, every command.

``mount -rw -o remount /``

After this command you can edit file and add/remove package via apt.

Before you exit the shell, you need to ``sync`` all the disk.

But, if you are an unlucky person (like me), this mode doesn't work for your issue.

I need to remove upstart package, but in this shell I did not have a network (even via ethernet).

So, before hard reset or copy the whole root partition to a new sd image, I decided to try with chroot command.

### WTF is chroot?

It's a command that can perform a change of root directory and you can exec some command (for example a /bin/bash). So, it's like you were connect directly to raspberry via SSH.

## BUT!

To this you need to have a VM or a PC with ubuntu (or other linux distro) and ``qemu-arm`` installed.

qemu is a package that can simulate the raspberry's architecture (arm64).

After installed qemu, you can mount from an img or from the sd card all the partitions.

**NOTE**: for creating the loopback device I usually use kpartx

If you are using a img file:
For example (this command will create, for each partition, a device called /dev/mapper/loop0pN):
``$ sudo kpartx -a -v 2015-02-16-raspbian-wheezy.img``

You need to mount the root and the boot partition, together, like this:

{% highlight bash %}
$ sudo mount /dev/mapper/loop0p1 /mnt
$ sudo mount /dev/mapper/loop0p1 /mnt/boot
{% endhighlight %}

Now you have your raspberry mounted. You need to connect to it! 
We are gonna do this using chroot command.

Before using chroot, we need to copy our /usr/bin/qemu-arm to the mounted raspberry partition, because chroot need that for start the shell.
So copy from /usr/bin/qemu-arm to /mnt/usr/bin/qemu-arm

After that you can run:
``sudo chroot /mnt /usr/bin/qemu-arm``

It will open a new root shell and that's it! Remember to sync after all the edits.

NOTE: remember, I'm the unluckiest man in the world, and after chroot I couldn't connect to internet (if config did not working, even network config or dhcp or ethernet).
So I need to mount even the proc/ directory of my ubuntu installtion to the new mounted partition of raspberry (/mnt/proc) and re-init the chroot.

After that, I launched ifconfig and dhcpclient config and it started to working.

It's a little bit complex here, but I hope to be of help to you!