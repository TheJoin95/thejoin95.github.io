---
layout: post
title: Register.it - Dynamic DNS Updater
description: Manage the DNS record for your domain
permalink: manage-record-dns-updater-register-python.html
icon: document
date: 2019-03-28
category: python
tags: [python]
---

# Register.it - Dynamic DNS Updater

Great! You have just purchased a .com domain for .99€ and now you can setting up everyting for running your application on your Raspberry Pi.
You are very happy, so you take your public ip address and put it on the domain's record A.

The morning after you feel great to have just published your app!
You want to share all over the world the link, but... "ERROR - Server DNS address could not be found"

Now you feel bad, very bad.

Ehy... I've got the solution: [Dynamic DNS Updater](https://github.com/TheJoin95/Register.it-Dynamic-DNS-Updater)!

## How it works

It works with Puppeteer by Google and NodeJS and it simulate the signin and the navigation trough the page and domains to add/delete a DNS record.

Make sure to have Crhome installed and Node v. > 6.

Then you can run the script typing:
```
node index.js --username=USERNAME_HERE --password=SECRET_PWD --domain=DOMAIN --name=RECORD_NAME --value=RECORD_VALUE --ttl=TTL_>_600 --type=RECORD_TYPE
```

Note that RECORD_TYPE can be one of the following values: NS, A, CNAME, MX, TXT, SRV, AAAA.

