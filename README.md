# Disconnect


This is a programmable discord (initially) chat bot written in TypeScript for deployment as a NodeJS application.  


## Siege Lookup (/lookup [UPlay name])

This is done by using a dummy account which requests an auth token from the uplay servers then forges a few requests to grab the relevent stats for a user.  This will likley break if Ubi ever changes their servers but has a few fallbacks so it will handle rejections more gracefully.

## Dice Roller (/roll [xdy+[xdy]|x])

This will add together any combination of dice and roll them randomly.  Examples:

    1d4+3+2d8-4
    20d4
    1d20+7
    etc...
    
## Contributing

You can create issues with feature suggestions or just implement something and submit it as a pull request.  The code follows standard TypeScript coding guidelines.

