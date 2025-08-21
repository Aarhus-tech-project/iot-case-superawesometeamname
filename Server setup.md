# Server setup

- NodeJS (v20.11.0) has been installed using nvm (https://github.com/nvm-sh/nvm)

#### Required packages

```bash
apt install sudo nginx mosquitto mosquitto-clients net-tools git docker.io build-essential
```

## NGINX

```conf
location /api/ {
	proxy_pass http://localhost:3000/;
	proxy_http_version 1.1;

	# Forward important headers
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
}
```