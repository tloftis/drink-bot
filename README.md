# The reason for approach

This is a simple frameworkless project, it may not look good but it is just to figure out why a framework is needed by

not having one. Finding the best way to make it manageable and as easy to develop with as possible. Also to not use
a database, in favor of again of making a custom solution again to learn


## The end goal

The goal is to have a touch screen interface for a raspberry powered device that allows for configurable drink mixing
machine. 

## Software

Software used is NodeJS since it is good for rapid development and allows for pure javascript development both on the 
font end and backend. For front end it will only use HTML5 standards and not Jquery will be allowed for native dev, 
boot strap styling but not boot strap javascript, font-awesome will be used to to Unicode icons being a bit of a pain
too lookup and find a good ui element for a button. Noty will be used for notifications since it is just easier.
and Swal2 for modals for rapid development, modals can be a pain to self implement in a manner as easy to use as swal.
Socket.io is there for future potential development, but isn't used by the project yet.


## Hardware

Using peristaltic pumps and relays controlled using the wiring-pi library for GPIO access. Raspberry pi for the brains,
and a combination of 3D printed and cut wooden portions for for the body. Food grade silicone tubes to transfer the
liquids, and either a HDMI touch screen or old smart phone for an interface attached to the device. Not sure which
yet.


## The Idea

I don't like Jquery, I don't like separating the UI specific code from the UI, so I want generic modules to be imported
in and the javascript for the ui to be in a script tag along side the specific HTML. There should be no <script> tags
other than the  the one holding the javascript for the HTML. 


### Exceptions and issues

The issue is the libraries used, they break that rule,
specially socket.io, I have attempted to make it an import statement, but that took long enough for me to give up for
the moment. Noty has been wrapped, but still breaks the rule, Swal also does but if it gets use, will also be wrapped.
Eventually I would like to take apart these modules and make them pure import statements, but that will wait until I 
have a fully working device.


I currently do a hacky method of including Libs and the header. I do have the header injected into all view REST calls
along side of them a JS file that injects the libs in as well as the libs CSS. I still don't think this is good, but I 
like if I could only have the libs, and have the header HTML separate, that I wouldn't have issue with it.
