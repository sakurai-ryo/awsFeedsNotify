FROM golang:latest

RUN mkdir /go/src/app

WORKDIR /go/src/app

ENV GO111MODULE=on

COPY . /go/src/app


CMD [ "./main" ]