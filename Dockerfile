FROM node:latest
MAINTAINER Opryshko Alexandr <sclif13@gmail.com>

COPY libpkcs11gost-engine.so /usr/lib/x86_64-linux-gnu/openssl-1.0.0/engines/libpkcs11gost.so
COPY openssl.cnf /usr/lib/ssl/openssl.cnf
COPY librtpkcs11ecp_1.4.5.0-1_amd64.deb /tmp/librtpkcs11ecp_1.4.5.0-1_amd64.deb

RUN apt-get update && apt-get --yes install libpcsclite1 && apt-get clean && dpkg -i /tmp/librtpkcs11ecp_1.4.5.0-1_amd64.deb && rm /tmp/librtpkcs11ecp_1.4.5.0-1_amd64.deb
