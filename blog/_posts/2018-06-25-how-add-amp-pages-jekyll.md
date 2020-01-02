---
layout: post
title: Jekyll - Add AMP Pages to your blog
description: Learn how to add the power of the AMP pages to your site built with Jekyll
permalink: how-add-amp-pages-jekyll.html
icon: file
date: 2018-06-25
category: jekyll
tags: [jekyll]
---

We already know the power of the AMP pages but... what if we'll use in our blog?
That would be incredible!

Let's to this!

## What we need?
- [Rubygems](https://rubygems.org/)
- [Jekyll](https://jekyllrb.com/)
- [amp-jekyll](https://github.com/juusaw/amp-jekyll)

And, of course... a blog with at least one post.

## Install & Setup the plugin

Install the plugin via the Gemfile
{% highlight bash %}
gem install amp-jekyll
{% endhighlight %}

Then add to your _config.yml the plugin:
{% highlight ruby %}
plugins:
  - amp-jekyll
{% endhighlight %}

**NOTE: Older Jekyll versions (below 3.6.0) use the key gems instead of plugins. When building a site with such version, use the old key.**

Then we need to specify the AMP Folder in the _config.yml, where all the pages will be stored:
{% highlight ruby %}
ampdir: YOURDIR
{% endhighlight %}

## Setting up the amphtml meta
Put this meta inside your head to link the AMP page to your post page (tell to Google: "Hey, I've got AMP!"):
{% highlight ruby %}
{% if page.path contains '_posts' %}
  <link rel="amphtml" href="{{ page.id | prepend: '/YOURDIR' | prepend: site.baseurl | prepend: site.url | append: '.html' }}">
{% endif %}
{% endhighlight %}

## Setting up some style
Now it's your turn: style your AMP page!
I can suggest you to use this awesome theme: https://github.com/ageitgey/amplify