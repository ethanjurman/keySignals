# keySignals
A way to send and receive keys to be listened to on a host machine - for the purposes of playing games (specifically design around playing Dokapon Kingdom).

![image](https://user-images.githubusercontent.com/1131494/71322947-78984f80-249b-11ea-82ff-e8bee890c787.png)

## Summary
keySignals is a java / javascript utility that hosts a simple website that listens for key presses. It then sends those key presses back to the host machine. The design of the overall key signalling and input reading is focused around wiimote control scheme. 

## Motivations
Certain games have poor support for dolphin netplay, and this solution does not require any installation (with the exception of the host machine installing this application, npm, java, and of course, dolphin). This also provides a simple utility for streaming audio and video across the web. 

## Startup
Run the `Server` java class to start listening to keypresses. This web application runs on port 2228. Requires maven install. Run `npm install` and `node server.js` in the `resources` folder to run the site. It will host on port 2229. Requires npm install. (It is my hope that I can at some point simplify this build process, but currently is not a priority of mine).
Afterwards that anyone who navigates to the website and inputs key presses on the page will get sent to the host machine. 
These key presses will always target the focused window, so for a game, make sure you are always focused on the game window.

## Establishing Video connection

host (localhost:2229/host.html) | remote (http://{hosts ip address}:2229
--- | ---
![image](https://user-images.githubusercontent.com/1131494/71323026-a631c880-249c-11ea-8a54-b06c66b62191.png) | ![image](https://user-images.githubusercontent.com/1131494/71323035-b77ad500-249c-11ea-8835-ec968cd3c8ef.png)

To get the video working, one machine can go to `http://{your public ip}:2229/host.html` and select an audio source and a video source (if it doesn't show audio devices yet, simply select start audio, and then the list should populate on a page refresh).
Other machines (that access the site via `http://{your public ip}:2229/`) select connect video afterwards.
In order to get sound working you'll need to pipe dolphins audio to a virtual mic- I personally use [VB Audio Virtual Cable](https://www.vb-audio.com/Cable/), but use whatever solution you feel comfortable with. This won't be neccesary once getDisplayMedia supports audio piping (as it does with chrome tabs and when sharing the entire desktop window).

Alternatively, you can use other video/ audio sharing techniques (Discord Streaming, etc...), but I've found best results by crafting my solution (surprisingly enough).

## Dolphin controller setup

Player 1 | Player 2
--- | ---
![image](https://user-images.githubusercontent.com/1131494/71322803-aa101b80-2499-11ea-8da0-81b5188ee432.png) | ![image](https://user-images.githubusercontent.com/1131494/71322807-bac09180-2499-11ea-8e77-aac2b8124700.png)

Player 3 | Player 4
--- | ---
![image](https://user-images.githubusercontent.com/1131494/71322808-c90ead80-2499-11ea-9f6f-9734c5f19766.png) | ![image](https://user-images.githubusercontent.com/1131494/71322810-d4fa6f80-2499-11ea-9560-c8a035559093.png)
