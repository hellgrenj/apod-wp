# apod-wp 
a simple cli tool that fetches the latest high resolution [APOD (Astronomy Picture Of the Day)](https://apod.nasa.gov/apod/astropix.html) from NASA, writes the explanation (written by a professional astronomer) on the image and sets it as your desktop wallpaper. works on windows, linux and mac. It's one simple command that's easy to schedule to run on an interval or on startup/login etc.

## prerequisites 
[node 6.9 or greater](https://nodejs.org/en/)

## install
```
npm install apod-wp -g
```

## run with demo API key (limited number of API calls)
```
apodwp
```
![cli](./apodwp-rec.gif)


## run with your own API key (recommened)
* Go to [NASA Open API's](https://api.nasa.gov/#live_example) and request an API key. You have to fill in 4 textboxes and click one button and you receive it instantly. Couldn't be easier!

* Now you can run the command with your API Key like so:
```
apodwp ThisIsYourKeyButItDoesntReallyLookLikeThis
```

## props
This is built on some lovely npm packages:  
[wallpaper](https://github.com/sindresorhus/wallpaper)  
[Jimp](https://github.com/oliver-moran/jimp)  
[shelljs](https://github.com/shelljs/shelljs)  
[superagent](https://github.com/visionmedia/superagent)  

And it is consuming the open API [APOD](https://api.nasa.gov/api.html#apod) from NASA.
