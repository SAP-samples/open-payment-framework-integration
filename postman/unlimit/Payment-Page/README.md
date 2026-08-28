## Introduction

The Postman Collection enables the [Unlimit (Cardpay) Payment Page](https://integration.unlimit.com/) to be used to take card payments through the Open Payment Framework (OPF). The shopper is redirected to Unlimit's hosted payment page and returned to the merchant on completion.

The integration supports:

* Authorization of card payments using the OPF "Payment Page" (Full Page) UX pattern, with pre-authorisation
* Deferred Capture
* Refunds, full and partial
* Authorization Reversal
* Notifications (webhooks), signature-verified and IP-restricted

Roadmap:
* Native OPF OAuth2 authentication — requires OPF support for the `password` grant type with Unlimit's `terminal_code` / `password` field names
* Incremental authorization (Unlimit supports an `INCREMENT` operation)
* Tokenization / recurring payments (Unlimit `/api/recurrings`)


## Setup Instructions

### Overview

To import the [Unlimit Payment Page collection](mapping_configuration.json) this page will take you through:

a) Creating your Unlimit merchant account and obtaining terminal credentials.

b) Creating a payment integration in the OPF workbench.

c) Preparing the [Postman environment](environment_configuration.json) with your OPF tenant and Unlimit values.

d) Configuring the callback and redirect URLs in the Unlimit portal.


### Creating your Unlimit account

Request a sandbox account from Unlimit. You will be given a **wallet / terminal code** and a **terminal password**, plus a **callback secret** used to verify webhook signatures.

> **Important:** the terminal must be enabled for **Payment Page mode**. Unlimit provisions terminals per mode, and a terminal configured for *Gateway* mode rejects the Payment Page request body with:
>
> ```
> INVALID_API_REQUEST: fields ['card_account'] may not be empty
> ```
>
> `card_account` is mandatory in Gateway mode and **not** used in Payment Page mode, so this error means the terminal is in the wrong mode — not that the request is malformed. Ask Unlimit to enable Payment Page mode on the terminal.

Terminals are also scoped per currency. Requesting a currency the terminal does not support returns:

```
Terminal with ID = <code> for currency <CUR> not found
```

### Creating the Payment Integration

Create a new payment integration in the OPF workbench and set the Merchant ID to your Unlimit terminal code. For reference, see [Creating Payment Integration](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).


### Preparing the environment_configuration file

**1. Token** — get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html). Prefix the value with **Bearer**.

**2. Root URL** — the base URL of your OPF tenant.

**3. Integration ID and Configuration ID**

* `integrationId` maps to `accountGroupId` in Postman
* `configurationId` maps to `accountId` in Postman

**4. Unlimit values**

| Variable | Description |
| --- | --- |
| `unlimitApiHost` | `sandbox.cardpay.com` for sandbox, `cardpay.com` for production |
| `unlimitTerminalCode` | Your Unlimit wallet / terminal code |
| `unlimitPassword` | Terminal password (marked sensitive) |
| `unlimitCallbackSecret` | Callback secret used to verify webhook signatures (marked sensitive) |

**5. Capture settings**

| Variable | Value | Description |
| --- | --- | --- |
| `capturePattern` | `CAPTURE_PER_SHIPMENT` | Deferred capture. Unlimit's capture takes no amount, so it is **full capture only** — do not use `PARTIAL_CAPTURE` |
| `enableOverCapture` | `false` | Not supported |
| `enableCaptureReAuth` | `false` | Not supported |


### Notifications

Two inbound authentications are applied:

* **Signature** — Unlimit sends a `Signature` header containing `SHA512(raw_body + callback_secret)` as lowercase hex. This is a digest, not an HMAC, so the authentication uses `isHmacSignature: false` with the secret concatenated into the source.
* **IP allowlist** — restricts callbacks to Unlimit's published egress addresses.

Notifications route per transaction type on `payment_data.status` (and `refund_data.status` for refunds), so authorization, settlement, refund and reversal events are each handled by their own block.

**The callback URL must be configured in the Unlimit portal — it cannot be sent per request.** Unlimit's API has no `callback_url` field. Use the Notification URL shown in the OPF workbench for your integration:

```
https://<your-opf-tenant>/opf/gateway/notifications/<accountGroupId>
```

> Note this URL contains the account group id, so it changes if the integration is recreated.

Redirect URLs, by contrast, **are** sent per request (`return_urls.success_url` / `decline_url` / `cancel_url` / `inprocess_url`) and override the defaults configured on the wallet, so each payment returns to its own OPF session.


### Allowlist

Add the following to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``sandbox.cardpay.com`` (sandbox) or ``cardpay.com`` (production)


## Summary

In summary you should have edited the following variables:

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId``

#### Unlimit specific
- ``unlimitApiHost``
- ``unlimitTerminalCode``
- ``unlimitPassword``
- ``unlimitCallbackSecret``
