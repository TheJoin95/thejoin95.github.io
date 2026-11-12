---
title: Micro Frontends - From the 00s to 20s
description: Micro Front-ends do not carry any magic formula, but a lot of method, many concepts and principles that derive a lot from the architecture of the Microservices.
permalink: microfrontend-from-00-to-20s
icon: hHntcuiLbOg
date: 2019-12-21
category: python
tags: [python]
---

# Micro Frontends — From the 00s to 20s

<div class="mx-auto">
    <img class="max-w-full" src="https://source.unsplash.com/hHntcuiLbOg/960x680" />
</div>

Micro Frontends, if a definition is necessary, should be defined as architectural concepts and principles of an application . An architectural pattern applicable also to the most critical side of a modern application: the frontend side.
A goal that this pattern has, is the division of a large and complex application (with a complex UI) into many small, independent applications, each suitable for carrying out only the intended task.
Each “micro-application” is independent from the other and this allows us to develop, by keeping the main guidelines of the main application, also with different technology or framework.
Obviously, this has its pros and cons, since then it will be necessary to maintain (also in terms of human resources) the various technologies (such as the various javascript frameworks ). This situation depends a lot on the organization of a company and from the project choices.
A point to underline is that all these micro-apps will then be “merged” to form the main application without the end user being able to notice. For the user, everything becomes a Single Page Application.
Clearly a SPA can be included within a parent wireframe , to manage any application lifecycle.
When do you need to use the Micro Frontend pattern?
The implementation of Micro Frontends is an important and difficult decision to take, above all because it may be necessary to rethink some parts and concepts of an existing application to get as close as possible to the principles of the Domain Driven Design.
A practical example, to understand how important it is to divide the application into multiple contexts, could be this: let’s imagine that we have an administration application that manages a school.
As simple as it may be, it hides various pitfalls. In fact, there are many actors involved that require various features. Just think at the pages that the application must have: staff profile, student profile, detail of subjects, electronic register, unofficial results, extra school courses and so on.
As can be seen from the list above, each functionality could refer to multiple actors, but the most important thing that is glimpsed is that each page is as if it were an application in itself. Each page, when viewed separately, is complete and this is where the Micro FrontEnd pattern comes in.


## So, why use this approach?

There are various aspects why it would be better to use this pattern in certain situations.
On large-scale projects we know all the dead times of an infinite build, or the cost of a deployment , or the inefficiency of some components that sink the whole project or, again, not being able to find a bug that causes a blocking error in the lifecycle of the entire application.

Based on the basic principles of the pattern, such as:
- Decentralization
- Automation
- DDD
- Error isolation
- Independence
- Agile / Lean method

It is easy to see how many everyday situations are resolved.
Each team that deals with an application will have full responsibility and independence of its functionality. You can even use a Continuos Delivery service!


## How can I implement the Micro Frontends pattern?


Micro Frontends must first be studied for each use case, this is as fundamental as it is if you wanted to build a microservices architecture .
There are various ways to develop this architecture and it depends on the project needs. Each portion of the application could be included:
directly from the edge , i.e. who serves everything (like a CDN) : Edge Server Side Include
processing the request on the server side, then returning everything already composed: Server Side Include
composing everything on the client side, starting from a configurator: Client Side Include
If you have a CDN, or a managed cloud server, with the chance of using the Edge Server Includes this could really be an advantage, low maintenance cost, and with a crazy fast speed. In the real world, unfortunately, there are not many services that provide this kind of service, not even AWS.
The choice of the implementation method need to be take only after careful analysis.

## Conclusion

The advantages of the Micro Frontend architecture are both architectural and resource side, since each dev could change team, change stack , remaining on the same project while still maintaining an efficient entry cost on a new feature.
A tip: if you want to start implementing this pattern you will need to be very open-minded.
In the next article I will analyze some case studies and some implementation. Stay tuned.