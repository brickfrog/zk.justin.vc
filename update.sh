#! /bin/bash
# Script to automatically update site

pushd /home/justin/coding/justin.vc/
tzk build public && tzk commit
popd
