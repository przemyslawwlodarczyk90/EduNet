FROM alpine:3.20

RUN apk add --no-cache busybox-extras shadow \
    && adduser -D student \
    && echo "student:student123" | chpasswd \
    && echo "Witaj w symulowanym laboratorium Telnet EduNet!" > /etc/motd

EXPOSE 23

CMD ["telnetd", "-F", "-p", "23", "-l", "/bin/login"]
