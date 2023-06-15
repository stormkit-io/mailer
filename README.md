# Stormkit Mailer (under active development)

Send automated emails, or launch campaigns through a simple API or an intuitive UI.

## Features

☑️ &nbsp;**SES Mailer:** Send emails through your own Amazon SES account.

✅ &nbsp;**SMTP:** Send emails through SMTP, such as your own Gmail account.

☑️ &nbsp;**Gmail API** Send emails through Gmail API.

✅ &nbsp;**Minimal UI:** Simple, intuitive UI to configure your templates

☑️ &nbsp;**Subscribers:** Upload your subscribers either through API or manually

☑️ &nbsp;**Unsubscribe:** Users can unsubscribe

☑️ &nbsp;**API:** Send emails to your users through a simple API

✅ &nbsp;**Free Forever:** Using Stormkit Mailer is free of charge

**Legend**

✅ Ready to use

☑️ Incomplete or not yet started

## Configuration

The Mailer is configured through environment variables. You can configure these
variables either by providing an `.env` file or by making these variables available
to your process.

| Variable | Description | 
| -------- | ----------- |
| ADMIN_USERNAME   | The user name that is used to login the Mailer app. |
| ADMIN_PASSWORD   | The password that is used to login the Mailer app. |
| SMTP_USERNAME    | The user name that is used to login your SMTP provider. | 
| SMTP_PASSWORD    | The password that is used to login your SMTP provider. |
| JWT_SECRET       | A random string that is used to encrypt your JWT tokens. |
| MAILER_FROM_ADDR | The address that will be used to send emails. | 

Note that some of these variables will be moved to the configuration page once the page is implemented. See https://github.com/stormkit-io/mailer/issues/2 for more details.

## Local development

```bash
$ git clone git@github.com:stormkit-io/mailer.git
$ cd mailer
$ npm install
$ npm run dev
```

Create an `.env` file on the root level of the repository and configure the environment variables mentioned in the [Configuration](#configuration) section.

✅ HMR enabled

✅ To force restarting the server, type `rs` and hit Enter on the terminal

## License

MIT
