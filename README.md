# Full Stack URL Shortener
Frontend has been [forked](https://github.com/piyush-eon/url-shortener) with significant changes.

## Frontend
- React JS
- Tailwind CSS
- Shadcn UI

## Backend & Infra
Url Shortener [Backend Repository](https://github.com/raythx98/url-shortener)

## Setup 
You will need to set up the following in Github Secrets
- BASIC_AUTH_PASSWORD
- EC2_HOST
- EC2_USER
- SSH_PRIVATE_KEY

### Generate Secrets
An easy way to generate cryptographically secure random strings is to use the following command:
```bash
python -c 'import secrets; print(secrets.token_urlsafe(32))'
```

### Deploy to EC2
Use Github Actions to deploy the application to EC2 instance