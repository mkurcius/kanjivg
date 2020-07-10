# Fork of great [KanjiVG](https://github.com/KanjiVG/kanjivg) repo

This fork was created in order to be able to install KanjiVG using npm.  



# Installation

`npm install @madcat/kanjivg`



# How to use

After installing `@madcat/kanjivg`, in `node_modules/@madcat/kanjivg/dist` dir you will find two folders:
* `orig` - original kanji SVGs from [KanjiVG](https://github.com/KanjiVG/kanjivg)
* `min` - minified version of kanji SVGs, which contains only paths. Paths preserve stroke order.

Each of above folders contains another two subfolders:
* `main` - kanji svg (without variations) 
* `variations` - additional kanji variations



# Licence

KanjiVG is copyright Ulrich Apel and released under the Creative Commons
Attribution-Share Aline 3.0 licence:

http://creativecommons.org/licenses/by-sa/3.0/

See the COPYING file for more details.
