gamestrut.js
==============

### Todo list:

* "z-indexed" background entities.
* Animated background entities.
* Proper implementation of sprite-based animation.
* Clean-up redundant/dead code.

==============
### What is gamestrut.js

A template-based JavaScript and HTML5 game framework. Core abstractions are provided for structured game development e.g.: Level classes and Entity Classes. 

Documentation to come soon. :)


The main point behind gamestrut.js is to provide JavaScript/HTML5 game developers the core elements of a game so they can structure their code without having to build these at the beginning of every project. These include abstractions in the form of classes: Game, Level, and Entities. These can then be used to produce game content in only a few hours or even minutes. 

On top of that, a physics engine comes included; the one of choice is "boxweb2d". This allows for the developer to save time writing level and game entity classes, and then having to code all the physics and collision logic for their game from scratch. Instead, an entity object already comes with default attributes for physics that can be changed for the perfect feel. 

As for keybinding, the standard JavaScript api for browser keybinds are too jittery and limiting for a decent gaming experience. Instead, the use of a library "Mousetrap.js" is used for 'konami code' features and fluid key response.

I hope this can help as a suitable jump start on game projects. Although the core aspects have already been developed, there is still a lot of polish to be done for a suitable development release. 

Happy game developing! 

==============
## Getting Started

To get started, there are three main classes with which to familiarize oneself:

1. Game
2. Level
3. Entities

### Game:

This class defines a 'Game' object, meaning it provides the basic programming of a game. This is based on a loop with the stages of: a logic update; clearing of the canvas element; rendering of the game graphics on the canvas element. Moreover, it holds 'Level' objects, and many functions allowing the coding of game logic, and populating its 'Level' objects (REFERENCE to api doc).

### Level:

This class defines a 'Level' object, meaning it is a datatype that holds entities to populate it:

* AnimateEntity
* TextEntity
* Background

**Note:** The 'Background' class creates an object that displays an image in the background of the level; it is the first entity to be rendered on the canvas, and does not interact with anything else. 
