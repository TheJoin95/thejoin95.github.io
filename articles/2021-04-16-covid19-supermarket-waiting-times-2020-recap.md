---
title: Covid19 - Supermarket waiting times - A 2020 project
description: An open source project to help people stand in line at the market as little as possible by givin an estimate waiting time for a point of interest
permalink: covid19-supermarket-waiting-times-2020-recap
icon: LNYdatC3znA
date: 2021-04-17
category: javascript
tags: [javascript]
---


# Covid19 - Supermarket waiting times - A 2020 project

<div class="mx-auto">
    <img class="max-w-full" src="https://source.unsplash.com/LNYdatC3znA/960x680" />
</div>


## The context

In March 2020 the world froze. A damn virus has spread across the globe and people have locked themselves up in their homes, safe.

Getting out was a risk. Go shopping, another one.

The problem is: the longer you stay out and in contact with other people, the more likely you are to contract the virus. Especially in closed and unventilated environments.

The project that I am presenting to you was created primarily for personal use and then, by word of mouth, it became public use worldwide (geographically). The project was not for profit but only to help others.

Since June 2020 it has been discontinued due to the slight improvement in cases and the clarity that has been made about the virus, as well as the various security measures that have been applied at the health level.

In this technical article I will briefly describe how the project was developed and the architecture behind it.

## Architecture

Initially the project resided on my raspberry, in a local network. Not having the need to go out on the public network, the performances were obviously excellent. Only one user.

Subsequently, thanks to the port forwarding of the router and a subdomain managed through dynamic dns, I made it accessible from the outside.

![](https://cdn-images-1.medium.com/max/2296/0*TyK0HwA25Q0TVcIM)

The first 10 days Raspberry managed to sustain good performances despite having Redis, uWSGI, API and the Frontend on the same machine.

It managed about 500/800 people a day.

The problems came in early April when, by word of mouth, the project began to expand. The daily people were around 3000/5000 people with around 8000 page views. Too much for my poor Raspberry.

Initially I thought that creating a local cluster was the right choice. Obviously it wasn't. So I decided to rely on an old provider I was relying on for other projects: OVH.

I bought a VPS with 2vCore, 4GB of RAM and 80GB NVMe, for two months, located in the Strasbourg datacenter. A decent car.

Thanks to Git and the configurations I had created locally on the Raspberry linux system (debian based), the setup on the new machine was not too difficult and not at all time consuming. An hour to put everything online and 15 minutes to change the dns.

I had several subdomains: 1 for the API, 1 for the frontend. The subdomain for the API had a suffix to determine the location of the server so as to set everything up to be able to scale to other geographical areas.

The frontend still resided on the Raspberry, thanks also to the NGINX cache. After a few weeks I changed this approach and put the frontend on the cloud via Github Pages.

In mid-April I had another spike in visits: around 100K users per day and over 200K page views. Obviously it all happened while I was sleeping. Classic.

I was not in the least ready and as a fallback I recreated the environment on raspberry by creating a new API subdomain so that I could use it in the list of domains available in the frontend.

I was splitting the load on at least two instances. Obviously that wasn't enough.

So I decide to use some free credit I had on Digital Ocean.

After analyzing Google Analytics and the logs, I then decide to buy a machine with the same characteristics as that of OVH on Digital Ocean, but located in New York.

In fact, the traffic came mainly from the east coast of America and Canada (west coast and east coast). In addition, I had also created a smaller fallback instance in London in case European traffic increased.

At the same time, after replicating the environment and setting up the machine, I optimize the code, the requests and the caching of the various requests / responses.

The project born for personal purposes was becoming popular in Canada and America.

So I decide to set up another, smaller, Digital Ocean machine located in western America.

Within half a day I can therefore re-establish and optimize everything, both from the point of view of architecture and from the point of view of software.

In summary: 4 machines in total that managed the backend part providing the APIs via uWSGI and Redis located in: France, England, East America and West America. Github Pages for the frontend, which was deployed through Continuous Deployment of Github and the use of Grunt as a task runner.

An example of an API domain was: api-geo-fr.domain.ext

Separate notes: the load sharing is based on the law of large numbers. Each connected client was assigned an API subdomain for its session from all available configured subdomains. If the subdomain was offline, it scaled to the next and so on until it gave an error and displays the ÔÇ£offline serviceÔÇØ message.

Surely I could do better and manage the ÔÇ£cloud computingÔÇØ issue in another way and with other services / providers.

During the project my priority was to provide the most up-to-date and truthful data possible with the least downtime. I often found myself managing problems for the first time that I had never seen before but thanks to workaround and transversal knowledge I was able to solve.

## How it worked

This project aimed to avoid crowds of people in various supermarkets and pharmacies during the covid-19 pandemic. Based on the geolocation of the device, it will show various points of interest such as supermarkets, pharmacies, clinics, bars etc., with an estimate of the waiting time and a forecast of the next hour.

The front end uses Open Street Map with the Leaflet.js library.

It also uses the client-side geocode.xyz API to retrieve the address and city details from the geographic coordinates retrieved from the HTML5 API.

The backend is powered by Flask, a micro-framework for building some simple APIs to retrieve data from Google Places.

NOTE: This project does not use the official Google API, but works via some sort of workaround / bug. We can call it scraping, but that's not the right word. The project was carried out in March 2020.

The data comes from Google Maps, like traffic data, in ÔÇ£real timeÔÇØ (according to Google's terms). The data is also based on last week's data, to have a history (based on Google), the time spent inside a place and the estimated waiting time to be able to complete the purchase. In the latest version, data is also crowdsourced through user feedback that anyone can provide by clicking on a location marker on the map.

The wait time is also based on the current popularity (readme as realtime) of a specific place. This feature isn't available for all places, but for the vast majority it is. In this way, the estimated waiting times can still be reliable, since the calculations made on these data try to take into account the emergency variables such as social distancing, less influx of people indoors, etc. The data is then divided into hours and weekdays.

All times are to be considered estimates.

In fact, the same data that you would see on Google is used, i.e. the data within the local business.

Please note that sometimes a place may have a parking area or other things where geolocation can make mistakes. I couldn't detect where the people are, if they are people or cars, how many people are in line etc. etc. The estimates are based on data that comes from Google with an additional formula to get an approximate wait time. This relative error can change from place to place.

## Backend

The backend was developed in Python 3.6 using the Flask micro-framework to build the project's API. The web services are then made available by the uWSGI web server which is configured with various workers to improve performance.

In fact, each API instance runs with a thread pool to allow the handling of many more simultaneous requests. This, of course, must be modulated according to the computational capabilities we have (CPUxRAM).

On the Raspberry I had certain threads, while on the other VPSs I had more threads.

Obviously there is always a limit, otherwise we could only have the opposite effect and therefore not an improvement.

The various endpoints available were:

- / geocode
- / places / get-waiting-times
- / places / get-by-name
- / places / explore
- / logger
- / places / browse
- / feedback

Geocoding was provided by the Here API and Geocode.xyz.

Geocoding was essential to derive the correct coordinates of the device or of an address that was specified, since the location of the device was optional.

The Here API has also been used for the places, browse, get-by-name and explore endpoints, to derive the actual place to search in the database from a place name or address.

The feedback endpoint relates to the part dedicated to crowdsourcing so as to update the times of the places for which users give their feedback, based on the geolocation to testify their presence on the site.

The key endpoint is clearly the get-waiting-times which uses the Redis cache connection to be able to search and persist places with their waiting times.

The application does not persist personal data of users.

Each Flask instance has a thread pool to process multiple requests simultaneously without conflicting. An access-control-origin header is set on each endpoint that does not allow the use of the API on other sites other than the specified domain, i.e. covid19-waiting-time.thejoin.tech.

This check was necessary as I had limited resources. In any case, the project could be distributed by anyone once the repository was cloned from Github.

## Frontend

The frontend was developed with a very simple stack, Vanilla Javascript and Grunt.

The CSS was built ad hoc as the page only featured a full screen map.

The project was not very complex and in fact not too many lines of code are needed to manage everything.

Grunt allows us to use polyfills and to split our html code into multiple files and then include them gradually. Everything will then be merged and minified.

The site is also a Progressive Web App and uses WebIAM principles to make the information on the application accessible to all. Clearly it is responsive and features are mainly shown via modals above the map canvas.

The User Experience and User Design were fundamental for the success of the entire web application. Making your application usable and immediately usable helps users navigate it. As soon as we land on the site we will be offered a modal that contains the main information and a small getting started to immediately start browsing the information.

The color encoding of the various pins or buttons on the map was equally crucial.

This feature also remains for those with color blindness.

## Conclusions

It was certainly one of the best projects I've worked on and I've had the pleasure of dedicating time to, as well as my passion. Understanding how a prototype released locally on the Raspberry at home to then be made public for friends and then globally taught me a lot this project was aimed at helping myself, but in the end it also helped other people. I may not have solved many problems or complexities, but the testimonies make me understand that there was a little help and this is enough for me.
