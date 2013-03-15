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

A BIF file is uploaded to the local client using the HTML5 File API. The BIF file is validated and its header information is read. The first few frames are read at the defined indices. Images are read in-memory and rendered through image tags. The images are encoded as base64 for visual rendering. No disk writes are used. A requested image index can also be displayed.

Whats Used
----------

1. JavaScript
1. HTML5 File API

Supported
---------

1. Latest Chrome (Yes)
1. Latest Firefox (Yes)
1. Latest Opera (Yes)
1. Latest Safari (Yes)
1. IE 10 (Requires testing)
1. Samsung TV 3.0 (3.0 SDK supports binary operation)
1. Mobile Platforms (when cross origin download is supported)

Future Features
---------------

1. Unit testing
    - [ ] Coverage 100%
1. Cross Origin (CORS/xhr2)
    - [ ] Download bif file outside local client
1. Local Storage
    - [ ] Save to disk
    - [ ] Disk or memory options
    - [ ] Caching
1. WebGL Acceleration
    - [ ] Textured images in parallel
    - [ ] Swipe acceleration

Goal
----

A common library approach for most clients that require trickplay.
