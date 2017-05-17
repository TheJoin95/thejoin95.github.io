---
layout: post
title: How to backup all collections from mongodb (raspberry)
description: How to backup all collections and database from mongodb istance hosted in server (in this case on raspberry)
permalink: how-to-backup-all-collections-from-mongodb-on-raspberry.html
icon: database
date: 2017-02-16
category: mongodb
tags: [raspberry, mongodb, backup]
---

After some problems with my raspberry power supply and mongo 3.0 I decided to make a dayly backup.
Sometimes happened that, after an unexpected shutdown (for an high load average and not too much power), some mongo collections may be broken. If it'll happen without any backup, the only words you can say are: I'm fuck.

Yeah, I know.. if you install mongo on a 32bit system with only 1GB ram (Raspberry Pi 3), you are probabily (like me) mad.
But! It's useful for some testing or a micro-system.

## So.. the solution

One of the idea that I've got is make a dayly backup. I use 3.0 mongo version, but it will be ok for > 3.0 version.
**NOTE: you need to install mongotools.**

Here is the code:

{% highlight bash %}

#!/bin/sh

APP_NAME="raspberry"

MONGO_HOST="127.0.0.1"
MONGO_PORT="27017"
TIMESTAMP=`date +%F-%H%M`
MONGODUMP_PATH="/usr/bin/mongodump"
BACKUPS_DIR="/home/pi/dump"
BACKUP_NAME="$APP_NAME-$TIMESTAMP"

$MONGODUMP_PATH

mkdir -p $BACKUPS_DIR
mv dump_file $BACKUP_NAME
tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
rm -rf $BACKUP_NAME

{% endhighlight %}

The workflow is:
* Launch mongodump in the directory of the script
* Create the directory (if not exist) for the backup's files
* Move "dump_file" (created by mongodump cmd) to our backup name file
* make a tar (for storage saving) of the file and then remove the old one

You need to program this script in your crontab like this:
``30 3    * * *   root    /bin/bash /home/pi/mongo.sh > /tmp/mongodump.log 2>&1 &``

Note: for restore the collections you need to tar the file then to mongorestore
