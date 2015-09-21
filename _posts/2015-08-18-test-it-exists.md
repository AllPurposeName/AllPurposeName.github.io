---
layout: post
title:  "Test It Exists"
date:   2015-08-18 18:19:37
tags: turing testing TDD BDD iterative steps
categories: code-life
tldr: Namespace your projects and keep granular tests
---
Often times I am asked by budding Rubyists why we write such simple iterative
steps when we test drive our development. I give a pretty standard Turing alumni
response espousing the usefulness of having robust, test driven code. I do like
to append a little anecdote when I have time (and their attention). The story is
short, sweet, and best of all replicable. It goes like this:

One day I was asked to debug a failing test by a now good friend
[Dmitry](dmitryblog). He was working on [Enigma](turing repo for enimga), a
project with little mystery and a lot of logic. The project was added to the
module one curriculum when I was entering the second module, so I justed missed
implementing this challenge myself.

A test in Dmitry's ```Parser``` class was giving a strange failure. Dmitry
had not quite test driven the class up until now and was alternating between
tweaking his code to pass the tests and the tests to be easier to pass. By the
time I was introduced to the problem, the code already had many amateur mistakes
I myself would have made had just 6 weeks ago.

{% highlight ruby %}
require 'minitest/autorun'
require 'minitest/pride'
require 'enigma'
# Somewhere in the enigma require
####################
require 'parser'
####################

class ParsingTest < Minitest::Test

  def test_it_exists
    assert Parser
  end

  def test_all_the_other_things
    # other irrelevant tests
  end
end
{% endhighlight %}

The failing test isn't what is interesting about this story. What is interesting
is when we fixed his code and passed the test, the ```Parser``` was
still misbehaving. Dmitry showed me that strangly the tests fail when he stops
importing the code to the test file via ```require './lib/parser'```. They
should error out because they can't find the file. The failure messages were
raising strange argument errors and the stack trace went into strange places
which didn't help us at all.

The expected error messages would display when he removed the ```
require_relative 'enigma'```, but that didn't make sense because enigma had a
```require 'parser'```in them.

I sat wracking my brain, looking through failure message after failure message.
At this point I had encountered some strange things in my own projects all of
which were not solving the problem. These include:

 * Not bundling
 * Having duplicate files open in your IDE and only one of them actually saving
 * Starting a class over, but still requiring the old file in your test
 * Misspelling the class name
 * Not inheriting from Minitest correctly ```ParserTest << MiniTest:unit```
(there are so many issues here)

The list of newbie mistakes goes on.

20 minutes later I gave up on the failing tests. I looked at the one green dot
on the screen; the only passing test.
{% highlight ruby %}def test_it_exists
  assert Parser
end{% endhighlight %}
The only thing working was the Parser constant existing. I threw in a
```binding.pry``` and immediately realized what was wrong. There already exists
a ```Parser``` constant in the Ruby Standard Library. It's some module the Enigma
file had mistakenly acquired via ```require 'parser'```. The lazy ```require
'enigma'``` in the test file scooped up this Parser module. So in total half an
hour of error delving, one aha moment, and two minutes of renaming all amounted
to a few lessons definitely learned.

Namespace your project and test that it exists.
