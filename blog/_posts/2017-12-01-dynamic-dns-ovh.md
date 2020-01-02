---
layout: post
title: How to configure Dynamic DNS (DynHost) - OVH
description: How to config your local machine (eg. Raspberry) to make DynHost (service of OVH) working
permalink: configure-dynhost-ovh-raspberry-for-dynamic-dns.html
icon: cog fa-spin
date: 2017-12-01
category: domains
tags: [raspberry, dns, domain]
---

OVH is maybe the best low cost provider, because it offers some useful tools for.. free!

## Let's get into it

First of all: what is DynHost? Here we go: https://docs.ovh.com/gb/en/

If you have a domain on OVH you can enable it and create your credentials.

### Oh no! How can I do this?!

You need to go into your client panel and:
- create a dynamic dns record in your ”zone dns records" (with your domain);
- create your credentials to update your ip (with the same domain or a wildcard C:)

## How it is working the DynHost?
The DynHost (and the DynamicDNS service in general...) is just a request from our local machine (with some authorization like "basic auth" or whatever..) to their service (like no-ip, DynHost..) with the actual ip of our local machine. Easy.

### The workflow:
- Local Machine make a request (with authorization) to the DynHost service
- The service receive the request with the new ip
- The service make a check: if the new ip is the same in our record DNS => I do nothing | otherwise => I need to update the record DNS
- Then, the service anwser to the request with a message info ([useful link with all the return codes](https://help.dyn.com/remote-access-api/return-codes/))

So, now.. we need to update our record DNS to make sure that our site is always online.
We can do this simply request to OVH service (you can try to open the url on the browser).

**NOTE: you need to change the username, the password and the hostname.**

{% highlight bash %}
curl -X GET 'http://yourusername:yourpassword@www.ovh.com/nic/update?system=dyndns&hostname=yourdomain.org'
{% endhighlight %}

It was easy. Yeah, it's not hyper secure but... you know, local machine... raspberry... low cost. ;)

And now we can program this curl in our crontab (or whatever) to make sure that we can update our ip frequently for our dns record.