#!/bin/bash

docker build --tag playatlas:latest --target prod .

docker save playatlas | podman load

systemctl --user restart playatlas