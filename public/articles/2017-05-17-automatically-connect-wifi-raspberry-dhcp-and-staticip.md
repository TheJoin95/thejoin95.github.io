---
title: Automatically setting up and connect Raspberry Pi to a Wifi network
description: Automatically setting up your raspberry to connect to your wifi, with a static ip or DHCP! Only via SSH tunnel!
permalink: automatically-connect-wifi-raspberry-dhcp-and-staticip
icon: 17HaOLLOXYM
date: 2017-05-17
category: raspberry
tags: [raspberry, wifi, static, dhcp]
---

# Automatically setting up and connect Raspberry Pi to a Wifi network

<div class="mx-auto">
    <img class="max-w-full" src="https://source.unsplash.com/17HaOLLOXYM/960x680" />
</div>

So you have bought your Raspberry and you want to figure out how it is working! If you wanna be cool, you don't install GUI and do your things only by CLI and via SSH... but! You need a connection to your local network!! How connect automatically our raspberry on boot to our wifi network?

Easy, with cron (or service) and via WPA config.
Here is how.

First of all, you need to identify your network name.
If you boot Raspbian to desktop, you can launch the wpa_gui (WiFi config) application and click 'Scan'. You'll find a list that has your network too with all flags you need. 

You know, I don't like this solution so, if you wanna be cool, you can do like this:
`sudo iwlist wlan0 scan` and find out your wifi ESSID and proto.

SSID is your network name.
After you found it, you need to update your /etc/wpa_supplicant/wpa_supplicant.conf file.
Here is an example:

{% highlight bash %}

network={
	ssid="YOUR_NETWORK_NAME"
	psk="YOUR_NETWORK_PASSWORD"
	proto=RSN
	priority=1
	key_mgmt=WPA-PSK
	pairwise=CCMP
	auth_alg=OPEN
}

{% endhighlight %}

psk is your network password. You need to write it there.
The other parameters are network specific, I can't tell you what you need.

- proto could be either RSN (WPA2) or WPA (WPA1).
- key_mgmt could be either WPA-PSK (most probably) or WPA-EAP (enterprise networks)
- pairwise could be either CCMP (WPA2) or TKIP (WPA1)
- auth_alg is most probably OPEN, other options are LEAP and SHARED
- priority is an incremental flag because you can specify more network connetions (just by duplicate the "network object"). Priority is an ascending field.

After doing this you can run `sudo ifdown wlan0 and sudo ifup wlan0` and verify your connection by ping another ip.
Now you have connected your RPi via DHCP. What if you wanna have a static ip?
Here we go.

We need to update our /etc/dhcpd.conf (for info about this file run `man dhcpcd.conf`) as the follow:

/etc/dhcpcd.conf:

{% highlight bash %}
# A sample configuration for dhcpcd.
# See dhcpcd.conf(5) for details.

# Allow users of this group to interact with dhcpcd via the control socket.
#controlgroup wheel

# Inform the DHCP server of our hostname for DDNS.
hostname

# Use the hardware address of the interface for the Client ID.
clientid
# or
# Use the same DUID + IAID as set in DHCPv6 for DHCPv4 ClientID as per RFC4361.
#duid

# Persist interface configuration when dhcpcd exits.
persistent

# Rapid commit support.
# Safe to enable by default because it requires the equivalent option set
# on the server to actually work.
option rapid_commit

# A list of options to request from the DHCP server.
option domain_name_servers, domain_name, domain_search, host_name
option classless_static_routes
# Most distributions have NTP support.
option ntp_servers
# Respect the network MTU.
# Some interface drivers reset when changing the MTU so disabled by default.
#option interface_mtu

# A ServerID is required by RFC2131.
require dhcp_server_identifier

# Generate Stable Private IPv6 Addresses instead of hardware based ones
slaac private

# A hook script is provided to lookup the hostname if not set by the DHCP
# server, but it should not be run by default.
nohook lookup-hostname

# look, I configured the static also per ethernet connection (just in case)
interface eth0

static ip_address=192.168.1.10/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1

# here is for wifi interface
interface wlan0

# ip/subnet class
static ip_address=192.168.1.10/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1

{% endhighlight %}

It's pretty simply here, you need just specify your static ip and gateway. Then reboot your wifi connection.

So, now you have configured your RPi with your wifi network and static ip but... what if the wifi network goes down and reup after 5min? You need to re-connect manually...

BUT! If you wanna be a cool guy:
check every minute (via crontab) if we are still connected to our wifi network and it's all up:

{% highlight bash %}
#!/bin/bash

if ifconfig wlan0 | grep -q "inet addr:" ; then
   echo "connected"
else
   echo "Network connection down! Attempting reconnection."
   ifup --force wlan0
   sleep 10
fi
{% endhighlight %}

You need to program this script in your crontab like this:
``*/10 *    * * *   root    /bin/bash /home/pi/check-wifi.sh``
