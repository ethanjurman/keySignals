# keySignals
A way to send and receive keys to be listened to on a host machine

## Summary
keySignals is a java / javascript utility that hosts a simple website that listens for key presses. It then sends those key presses back to the host machine. The design of the overall key signalling and input reading is focused around wiimote control scheme. 

## Motivations
Certain games have poor support for dolphin netplay, and this solution does not require any installation (with the exception of the host machine installing this application, npm, java, and of course, dolphin). 

## Startup
Run the `Server` java class to start listening to keypresses. Run `npm install` and `node server.js` in the resources folder to run the site. It will host on port 2229 by default. Requires maven install and npm install. After that anyone who navigates to the website and inputs key presses on the page will get sent to the host machine.

To get the video working, one machine can go to `http://{your public ip}:2229/host.html` and select an audio source and a video source (if it doesn't show audio devices yet, simply select start audio, and then the list should populate on refresh).
Other machines (that access the site via `http://{your public ip}:2229/`) select connect video afterwards
