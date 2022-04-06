#! /bin/bash
# Script to automatically update site, using cron from within wsl

pushd /home/justin/coding/justin.vc/ && tzk build public && tzk build feed && tzk commit;
popd
