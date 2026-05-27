## Introduction ##
The Postman Collection enables an [SVS (Stored Value Solutions) Gift Card](https://www.storedvalue.com/) integration for payment processing through Open Payment Framework (OPF).

The integration supports:

* Authorization and capture of gift card payments via the SVS REST Gift Card API (Pre-Auth → Pre-Auth Complete flow)
* Deferred and partial capture
* Refunds (Refund-To-New-Payment)
* Reversals / cancellations
* Card Valet (Buyatab) digital gift card issuance via OAuth2-secured API

In summary: to import the [SVS Postman Collection](mapping_configuration.json), this page will guide you through the following steps:

a) Obtain your SVS test (UAT) credentials and your Card Valet / Buyatab API credentials.

b) Create an SVS payment integration in the OPF workbench.

c) Set up your SVS UAT account and Card Valet account to work with OPF.

d) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF tenant, SVS UAT and Card Valet unique values.


## Obtaining SVS and Card Valet Credentials ##

SVS does not offer self-service signup. Both sets of credentials are issued by SVS / Buyatab to onboarded merchants:

* **SVS REST Gift Card API (UAT)** — provides the credentials required for the encrypted-session ("CSM") authentication flow described in the *SVS SOA External Consumer Guide* and *Step by Step notes for SVS REST authentication and services v 2.0*: an `Auth-Id`, a 256-bit `rootKey`, the encryption `algorithm` (AES/CBC/PKCS5Padding) and a null `initialVector`. UAT host: `svc-cert.storedvalue.com`. Production host: `svc.storedvalue.com`.
* **Card Valet API (UAT)** — issued by Buyatab; provides the OAuth2 `client_id`, `client_secret`, `audience` and Identity Provider token URL described in the *Card Valet API Reference v2.0.0*. UAT base URL: `https://uat-api-gc.egiftlabs.com/api`. Token URL pattern: `https://buyatab-uat.us.auth0.com/oauth/token`.

Coordinate with your SVS / Buyatab representative to receive these values before continuing.


## Creating an SVS Payment Integration ##
Create an SVS payment integration in the OPF Workbench. For reference, see [Creating Payment Integration](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).


## Preparing the Postman environment_configuration file

The `environment_configuration.json` file ships with placeholder values that must be replaced before the collection can be run. The variables fall into three groups:

1. **OPF tenant identification** — common to every Postman collection in this repo.
2. **OPF payment configuration** — capture / refund pattern, authorization timeout etc., applied via the configuration update calls in the collection.
3. **SVS REST Gift Card API authentication** (export 812) — the encrypted-session credentials.
4. **Card Valet (Buyatab) OAuth2 authentication** (export 1026) — the OAuth2 client-credentials credentials.
5. **SVS payment-method variables** — values written into the integration's variable bag (`authId`, `storeNumber`, `accountCode`, `CardStyleCode`, `StorefrontCode`, `svsPaymentHost`).

### 1. OPF tenant identification

| Variable | Description |
| --- | --- |
| `token` | OPF API access token (a JWT). Obtain by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html). **IMPORTANT**: prefix the value with `Bearer ` so the header is sent as `Bearer {{token}}`. |
| `rootUrl` | Base URL of your OPF tenant. E.g. if your workbench URL is `https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench`, set this to `https://opf-iss-d0.uis.commerce.stage.context.cloud.sap`. |
| `service` | OPF service path segment used by the collection requests. Default `opf`; do not change unless your tenant uses a different path. |
| `accountGroupId` | Maps to the `integrationId` shown in the top-left of your configuration details page in the OPF workbench. Identifies the SVS payment integration. |
| `accountId` | Maps to the `configurationId` shown in the same area of the OPF workbench. Identifies the SVS payment configuration inside the integration. |

### 2. OPF payment configuration

These values are PATCHed onto the payment configuration by the collection. Values reflect the recommended defaults for SVS gift cards.

| Variable | Description                                                                                                                                                                                                                                                                                  |
| --- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `capturePattern` | Capture pattern. Default `PARTIAL_CAPTURE` so partial captures (multi-shipment) are supported on top of an SVS Pre-Authorization. Other valid values: `IMMEDIATE_CAPTURE`, `CAPTURE_PER_SHIPMENT`.                                                                                           |
| `enableOverCapture` | Whether to allow capture amounts greater than the original authorization. Default `false`. SVS Pre-Auth Completes can exceed the held amount (per *Pre-Auth guidelines v1.4*), but the OPF default is to disallow it unless explicitly required.                                             |
| `enableCaptureReAuth` | Whether to issue a fresh authorization when the original SVS Pre-Auth has expired and a capture is still pending. Default `false`.                                                                                                                                                           |
| `refundPattern` | Refund pattern. Default `REFUND_TO_NEW_PAYMENT` — refunds are issued as new gift card credit transactions rather than reversing a captured transaction. Other valid value: `REFUND_FOLLOW_ON`.                                                                                               |
| `maxStoredValueCardRefund` | Maximum amount that may be refunded to a stored-value (gift) card per transaction, expressed in the integration's currency. Default `300.00` (test value — set to your operational ceiling).                                                                                                 |
| `authorizationTimeoutDays` | Number of days an SVS Pre-Authorization is considered valid in OPF before it must be re-issued. Default `7`. Aligns with the SVS server-side hold expiry policy described in the Pre-Auth guidelines (a Pre-Auth hold is indefinite at SVS but should be released by completion or timeout). |

### 3. SVS REST Gift Card API authentication

These seven variables populate the `ENCRYPTED_SESSION_AUTH` outbound authentication used for every SVS Gift Card REST call. The flow is: client uses `rootKey` against `authUrl` to retrieve an active key (KEX message), then negotiates a session id and TVB value (TTM message) and signs subsequent calls (SMA messages) with the active key. See the *SVS SOA External Consumer Guide* §1.3–§1.6 and the *Step by Step notes for SVS REST authentication and services v 2.0* for the full handshake.

| Variable | Description |
| --- | --- |
| `authentication_outbound_encrypted_session_auth_url_export_812` | The SVS authentication URL. UAT example: `https://svc-cert.storedvalue.com/oltp-gift/authenticate/`. The collection uses the `oltp-gift` (Gift Card) service. |
| `authentication_outbound_encrypted_session_auth_id_export_812` | The `Auth-Id` value SVS assigns to your `oltp-gift` integration. Sent in the `Auth-Id` HTTP header on every SVS REST request and populates the `RCV` field in the CSM messages. |
| `authentication_outbound_encrypted_session_root_key_export_812` | The 256-bit hex-encoded root key SVS provides during onboarding. Used **only** for the very first authentication call; SVS responds with a fresh active key (KEX) that is used thereafter. Keep the root key as a backup in case the active key is lost. |
| `authentication_outbound_encrypted_session_username_export_812` | The username (USR) sent in the SMA message body once a session is established. Per the *SVS SOA External Consumer Guide* §1.4 and §1.6, the username is tied to a company (i.e. a range of gift cards) and is assigned by SVS when you integrate. It appears as the `USR/` field in every SMA CSM message (e.g. `CSM(MCL/SMA … USR/[User] PWD/[Password])`). An invalid username will result in a failed service response and an HTTP 403. |
| `authentication_outbound_encrypted_session_password_export_812` | The password (PWD) sent in the SMA message body once a session is established. Paired with the username above; both are provisioned by SVS on integration. Per *SVS SOA External Consumer Guide* §1.4, invalid credentials result in a failed service response and an HTTP 403. |
| `authentication_outbound_encrypted_session_algorithm_export_812` | The symmetric encryption algorithm. Per the SVS SOA guide §1.5: `AES/CBC/PKCS5Padding`. |
| `authentication_outbound_encrypted_session_initial_vector_export_812` | The AES initialization vector. Per the SVS SOA guide §1.5, this is a null IV: `00000000000000000000000000000000` (32 hex zero bytes). |

### 4. Card Valet (Buyatab) OAuth2 authentication

These five variables populate the `OAUTH2_AUTHENTICATION` outbound authentication used for the Card Valet (Buyatab) digital gift card endpoints. Follows the OAuth2 client-credentials flow described in *Card Valet API Reference v2.0.0* — *Get Access Token*.

| Variable | Description |
| --- | --- |
| `authentication_outbound_oauth2_token_url_export_1026` | The Identity Provider token endpoint. UAT default: `https://buyatab-uat.us.auth0.com/oauth/token`. |
| `authentication_outbound_oauth2_client_id_export_1026` | The `client_id` issued with your Card Valet API credentials. |
| `authentication_outbound_oauth2_client_secret_export_1026` | The `client_secret` issued with your Card Valet API credentials. **Sensitive.** |
| `authentication_outbound_oauth2_audience_export_1026` | The `audience` claim required by Buyatab's identity provider. UAT default: `https://uat-api-gc.egiftlabs.com`. Production: `https://api-gc.buyatab.com` (or as supplied with your credentials). |
| `authentication_outbound_oauth2_use_basic_auth_export_1026` | Whether to send `client_id` / `client_secret` as an HTTP Basic auth header instead of in the request body. Default `false` — the credentials are sent in the request body, matching the form documented in *Card Valet API Reference v2.0.0*. |

### 5. SVS payment-method variables

These five values are written into the integration's variable bag by the *Variable* requests in the collection. They are referenced by FreeMarker templates inside the SVS mapping at request time.

| Variable | Description |
| --- | --- |
| `authId` | The same SVS `Auth-Id` as the encrypted-session authentication record above, exposed as a template variable so it can be referenced in mapping bodies (e.g. for logging or auxiliary headers). Per the *SVS Rest Gift Card API Version 2.1* §HTTP Headers, this identifies the `oltp-gift` provider. |
| `storeNumber` | A 10-character, right-justified, zero-padded numeric string identifying the specific store originating the transaction. Sent in every gift card request body (issue / pre-auth / pre-auth complete / cashout / reversal etc.). Per *SVS Rest Gift Card API Version 2.1* — Appendix B — *Field Usage*: `storeNumber` is **mandatory** and identifies the store. Test value: `0000001234`. |
| `accountCode` | The Card Valet **Account Code** — a GUID issued by Buyatab. **Used by the REFUND flow** (`REFUND_TO_NEW_PAYMENT`): when a refund is processed, OPF issues a brand-new digital gift card via the Card Valet API rather than reversing the original SVS transaction. Per *Card Valet API Reference v2.0.0* — *Card Valet Account / API Credentials*, this is the unique identifier for your Card Valet account and is used in every Card Valet refund endpoint URL (e.g. `GET /v1/storefront/{StorefrontCode}/{accountCode}`, the order-creation endpoints). |
| `CardStyleCode` | A GUID identifying the visual style applied to the new digital gift card. **Used by the REFUND flow** to choose which card design is rendered on the gift card issued as the refund. Per *Card Valet API Reference v2.0.0* — *Storefront Restrictions*: the unique identifier for the image displayed with the gift card (the image shown on the digital gift card web page). |
| `StorefrontCode` | A GUID identifying the brand entity (storefront) the new gift card is issued under. **Used by the REFUND flow** to associate the issued refund gift card with the correct brand. Per *Card Valet API Reference v2.0.0* — *Storefront Restrictions*: the unique identifier for a particular brand entity. Used in `GET /v1/storefront/{StorefrontCode}/{accountCode}`. |
| `svsPaymentHost` | The SVS REST API host used as the base for outbound payment calls in the mapping. UAT default: `svc-cert.storedvalue.com`. Production: `svc.storedvalue.com` (per the *SVS SOA External Consumer Guide* §1.1). |

### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

SVS Gift Card REST API (per *SVS SOA External Consumer Guide* §1.1):

* UAT: ``svc-cert.storedvalue.com``
* Production: ``svc.storedvalue.com``

Card Valet (Buyatab) — base API host (per *Card Valet API Reference v2.0.0* §Account Setup):

* UAT: ``uat-api-gc.egiftlabs.com``
* Production: ``api-gc.buyatab.com``

Card Valet (Buyatab) — OAuth2 Identity Provider (`AppDomain` / `Issuer Domain`):

* UAT: ``buyatab-uat.us.auth0.com``
* Production: ``buyatab-prod.us.auth0.com``

### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables:

#### Common
- ``token``
- ``rootUrl``
- ``service`` (only if non-default)
- ``accountGroupId``
- ``accountId``

#### OPF Payment Configuration
- ``capturePattern``
- ``enableOverCapture``
- ``enableCaptureReAuth``
- ``refundPattern``
- ``maxStoredValueCardRefund``
- ``authorizationTimeoutDays``

#### SVS REST Gift Card API 
- ``authentication_outbound_encrypted_session_auth_url_export_812``
- ``authentication_outbound_encrypted_session_auth_id_export_812``
- ``authentication_outbound_encrypted_session_root_key_export_812``
- ``authentication_outbound_encrypted_session_username_export_812``
- ``authentication_outbound_encrypted_session_password_export_812``
- ``authentication_outbound_encrypted_session_algorithm_export_812``
- ``authentication_outbound_encrypted_session_initial_vector_export_812``

#### Card Valet OAuth2
- ``authentication_outbound_oauth2_token_url_export_1026``
- ``authentication_outbound_oauth2_client_id_export_1026``
- ``authentication_outbound_oauth2_client_secret_export_1026``
- ``authentication_outbound_oauth2_audience_export_1026``
- ``authentication_outbound_oauth2_use_basic_auth_export_1026``

#### SVS Payment-Method Variables
- ``authId``
- ``storeNumber``
- ``accountCode``
- ``CardStyleCode``
- ``StorefrontCode``
- ``svsPaymentHost``
