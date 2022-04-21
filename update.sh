#! /bin/bash
# Script to automatically update site, using cron from within wsl

pushd /home/justin/coding/justin.vc/ && /home/justin/anaconda3/bin/tzk build public && /home/justin/anaconda3/bin/tzk commit;
popd
