#!/bin/bash

cat ./js/litter.js | docker run -i --rm jborza/closure-compiler > ./js/litter.min.js
