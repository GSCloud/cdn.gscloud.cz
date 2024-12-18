#!/bin/bash

cat ./shit.js | docker run -i --rm jborza/closure-compiler > ./shit.min.js
