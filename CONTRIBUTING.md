# Contributing to TouchUI

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for TouchUI. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). If you'd like, you can use [this template](#template-for-submitting-bug-reports) to structure the information.

#### OctoPrint and plugins
Sometimes bugs can be related to a specific plugin or OctoPrint version. Since TouchUI extends the code base of OctoPrint, a bug can also exist in the default interface.
* Check if the bug also exists in the default interface. If yes, report this problem to [OctoPrint](https://github.com/foosel/OctoPrint).
* Check if you have installed a plugin that interferes with TouchUI or your bug. If you do; try to disable it. If it has no effect, add this to your bug report.

#### Before Submitting A Bug Report

* **Check the [Troubleshooting on the Wiki](https://github.com/BillyBlaze/OctoPrint-TouchUI/wiki/Setup:-Troubleshooting)** for a list of common questions and problems.
* **Perform a [cursory search](https://github.com/Unn4m3DD/OctoPrint-TouchUI/issues?utf8=%E2%9C%93&q=)** to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#octoprint-and-plugins) your bug is related to, create an issue on that repository and provide the following information.

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Which version of OctoPrint and TouchUI are you using**?
* **What's the name and version of the Browser you're using**?
* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. Don't just say what you did, but explain how you did it. For example, if you moved the cursor to the end of a line, explain if you used the mouse, or a touch swipe.
* **Explain which behavior you expected to see instead and why.**
* ~~**If the problem is related to performance**, include a [CPU profile capture and a screenshot](https://atom.io/docs/latest/hacking-atom-debugging#diagnose-performance-problems-with-the-dev-tools-cpu-profiler) with your report.~~ [work-in-progress]

##### **When reporting a browser issues:**
* **Include the output of your JavaScript console**:
  * See [How to open the Javascript Console in different browsers](http://webmasters.stackexchange.com/a/77337)
  * Use pastebin or [gist](https://gist.github.com/) to store your javascript log

##### **When reporting a layout issues:**
* **Include screenshots and animated GIFs**. You can use [this tool](http://www.cockos.com/licecap/) to record GIFs on OSX and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.

##### **When reporting OS/Touchscreen issues:**
* **What's the name and version of the OS you're using**?  
  Include details about your configuration and environment:


#### Template For Submitting Bug Reports
```
[Short description of problem here]

**Reproduction Steps:**
1. [First Step]
2. [Second Step]
3. [Other Steps...]

**Expected behavior:**
[Describe expected behavior here]

**Observed behavior:**
[Describe observed behavior here]

**Screenshots and GIFs**
![If required: Screenshots and GIFs which follow reproduction steps to demonstrate the problem](url)

**Javascript console**
![If required: Link to pastebin or gist](url)

**Browser version:** [Enter Browser version here]
**OctoPrint version:** [Enter OctoPrint version here]
**TouchUI version:** [Enter TouchUI version here]

**Installed plugins:**
1. [package 1]
2. [package 2]
```

### Your First Code Contribution

Unsure where to begin contributing to TouchUI? You can start by looking through `help-wanted` issues:

* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

### Pull Requests

* Include screenshots and animated GIFs in your pull request whenever possible.
* ~~Follow the [JavaScript](https://github.com/styleguide/javascript),
  and [LESS](https://github.com/styleguide/css) styleguides.~~ [work-in-progress]
* End files with a newline.
* Target the branch maintenance 

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally
* Consider starting the commit message with an applicable emoji:
    * :sparkles: `:sparkles:` when adding a new feature
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

---------

Thanks to Atom for proving a solid contributing template.
