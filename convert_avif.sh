#!/bin/bash

npx avif --input="public/assets/photos/$1/$2.$3" --output="public/assets/photos/$1/"
if [[ -f "public/assets/photos/$1/$2.avif" ]]; then
    rm "public/assets/photos/$1/$2.$3"
    count=$(ls -1 public/assets/photos/$1 | wc -l)
    mv "public/assets/photos/$1/$2.avif" "public/assets/photos/$1/${count#${count%%[! ]*}}.avif"
else
    echo "Failed to convert $2 to AVIF format."
fi