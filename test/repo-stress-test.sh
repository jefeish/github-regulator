#! /bin/bash

# ----------------------------------------------------------------------------
# Mini stress test for the Policy App
# Create as many Repos as possible (API rate limit) to trigger the Policies
# 
# This script requires the following environment variables:
#
# TOKEN - the token to use for the API calls
#
# NOTE: Depending on the number of Repos created, you may hit Rate-limting
# ----------------------------------------------------------------------------

START=1
END=20

if [ "$1" != "delete" ]; then

    echo Create new repos
    for (( n=$START; n<=$END; n++ ))
    do
        curl -X POST -H "Accept: application/vnd.github.v3+json" -H  "Authorization: token ${TOKEN}" https://api.github.com/orgs/jester-lab/repos -d "{ \"name\":\"test-${n}\" }" && \
        git clone https://github.com/jester-lab/test-${n}.git && \
        echo "# README.md" > test-${n}/README.md && \
        git -C test-${n} add README.md && git -C test-${n} commit -m "Initial commit" && git -C test-${n} push origin main &
    done

fi

# ----------------------------------------------------------------------------------------------------------------------

if [ "$1" == "delete" ]; then

    echo Delete the repos
    for (( n=$START; n<=$END; n++ ))
    do
        curl -X DELETE -H "Accept: application/vnd.github.v3+json" -H  "Authorization: token ${TOKEN}" https://api.github.com/repos/jester-lab/test-${n} &
        rm -rf test-${n}
    done 

fi