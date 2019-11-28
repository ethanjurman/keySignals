# keySignals
A way to send and receive keys to be listened to on a host machine

## Summary
keySignals is a java / javascript utility that hosts a simple website that listens for key presses. It then sends those key presses back to the host machine. The design of the overall key signalling and input reading is focused around wiimote control scheme. 

## Motivations
Certain games have poor support for dolphin netplay, and this solution does not require any installation (with the exception of the host machine). Of course a video sharing client (such as Google Hangouts, OBS, etc...) is required to share the contents of the video, but for games that don’t require lagless interfaces (and can deal with some latency) this solution is more than adequate. On a good connection, I’ve found that the delay is roughly 300ms with 4 people (which is expected for webRTC video connections - such as google hangouts).

## Startup
Run the `Server` java class to start hosting. It will host on port 2229 by default. Requires maven install. After that anyone who navigates to the website and inputs key presses on the page will get sent to the host machine.
