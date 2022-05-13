# SLEEPY BIRD
CSC 2463 Final Project
This is a simple Flappy Bird game remake for Programming Digital Media course. This project includes a redesigned graphic inspired from the various "cozy game" themes with earth-tone color scheme. In this game, you will play as a bird, wearing PJ (hence the name "Sleepy Bird"). The goal is to get the bird to fly through as many pipes as possible without touching them, or falling to the ground.
Graphic elements including background, ground and pipes, are made using Procreate, and are animated through p5.js. The sounds from this bird includes flapping sound, fun sound when score, and a sound when bird hits pipes or fall to ground. The first two are synthesized using synths from Tone.js library, and the last is a sampler.

The game is controlled fulling using Arduino UNO's push button. The bird flies up when you push the button and is set to fall down by default if button is not pushed. An Arduino's led light is set to be ON by default. If bird hits or falls, light will fade out as a signal.

Graphic components:

![flappy-bg](https://user-images.githubusercontent.com/81435790/168191231-e568194f-e992-49a3-be04-38720f48ec93.png)
![pipe-upward](https://user-images.githubusercontent.com/81435790/168191254-479c2585-6fe1-4155-953d-4946b1f727fd.png)
![pipe-downward](https://user-images.githubusercontent.com/81435790/168191262-810f4718-2de1-4070-b25f-f8e6be03c6f3.png)
![flappy-ground](https://user-images.githubusercontent.com/81435790/168191237-88fc521b-185b-410e-b979-d1dcdf1138c4.png)
![flappy-birdsprite](https://user-images.githubusercontent.com/81435790/168191245-adebbca1-eefd-434e-96cc-275f613b93a6.png)


Scences from game:

![Picture1](https://user-images.githubusercontent.com/81435790/168191065-82b3c041-97ba-4b9b-beff-473d628433fb.png)
![Picture4](https://user-images.githubusercontent.com/81435790/168191109-f4f0f527-e43f-45c0-afd0-da8e6a8bba02.png)
![Picture3](https://user-images.githubusercontent.com/81435790/168191114-983fd9da-f953-45dd-8e97-9a7c02ae8214.png)
![Picture2](https://user-images.githubusercontent.com/81435790/168191087-7f09671a-e5dc-46b3-9f2c-e5aab97c44aa.png)

Arduino breadboard layout:

![breadboard](https://user-images.githubusercontent.com/81435790/168191588-4dce045c-c8d1-42c1-bb8d-0c365038d64a.jpg)

Video DEMO: https://studio.youtube.com/video/lrZNcRkdIEE/edit

Future Development Possibility:

* Adding a funky sound for the home scence
* Ultimate end game scence, possibly at score 1500 - 2000 as an Easter egg
* Multiplayer game with 2 birds
* Refine bird sprites with more facial expression
* Fixing loose button on Arduino breadboard to guarantee pleasant gaming experience
