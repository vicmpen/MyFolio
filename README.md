# MyFolio

Before running, make sure you type 'npm install' in the project's root directory

A small Javascript script, that calculates your cryptocurrency holdings worth

Create a small txt file with 2 rows; the first has the symbols of your crypto holdings (e.g eth, btc, xpr)
and the second has the corresponding amount of coins/tokens. The end result should look like this:

/* crypto.txt  */

eth,btc,xpr
10,15,1000

/* crypto.txt */

You can also leave the file parameter empty. Then by default the script searches in it's folder a file named 'crypto.txt', without
quotes.

Tested on mac. Happy to take in PRs for other platforms!
