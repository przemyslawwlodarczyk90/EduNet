FROM alpine:3.20

RUN apk add --no-cache vsftpd shadow \
    && adduser -D student \
    && echo "student:student123" | chpasswd \
    && mkdir -p /var/ftp \
    && echo "Witaj w symulowanym laboratorium FTP EduNet!" > /var/ftp/powitanie.txt

COPY vsftpd.conf /etc/vsftpd/vsftpd.conf

EXPOSE 21

CMD ["vsftpd", "/etc/vsftpd/vsftpd.conf"]
