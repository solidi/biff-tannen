     ______ __  ___   ______                __            
    |   __ |__.'  _| |   __ .-----.---.-.--|  .-----.----.
    |   __ |  |   _| |      |  -__|  _  |  _  |  -__|   _|
    |______|__|__|   |___|__|_____|___._|_____|_____|__|  

About
-----

BIF Reader demostrates how JavaScript can be used to read and render images from a image archive file called BIF.

What Is A BIF File
-------------------

A BIF file is a binary container format of images at set indices. A BIF file can contain either PNG or JPEG image formats. Resolution and sizing of the images are unlimited. Total file size should be considered.

How Is BIF Used
----------------

BIF files are transmitted synchronously for client rendering. A BIF file can contain hundreds of images. It is normally used to transport trickplay preview thumbnails.

How This Works
--------------
A BIF file is uploaded to the local client using the HTML5 File API. The BIF file is validated and its header information is read. The first few frames are read at the defined indices. Images are read in-memory and rendered through to <img src> tags. The images are encoded as base64 for visual rendering. No disk writes are used. A requested image index can also be displayed.

Whats Used
----------
1. JavaScript
2. HTML5 File API

Supported
---------

1. Latest Chrome
2. Latest Firefox
3. Latest Opera
4. IE 10
5. Samsung TV 3.0
6. Mobile Platforms

Future Features
---------------

1. Unit testing
    - [ ] Coverage 100%
2. Local Storage
    - [ ] Save to disk
    - [ ] Disk or memory options
    - [ ] Caching
3. WebGL Acceleration
    - [ ] Textured images in parallel
    - [ ] Swipe acceleration

Goal
----

A common library approach for most clients that require trickplay.
