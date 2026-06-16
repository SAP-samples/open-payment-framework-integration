# payever Integration for the Open Payment Framework (OPF)

## Introduction

This Postman Collection helps you integrate [payever](https://getpayever.com/) into the SAP **Open Payment Framework (OPF)**.

The integration demonstrates the following capabilities:

* **Authorize** a card using the Hosted Payment Page
* **Settlement** (capture)
* **Refund**
* **Reversal**

It shows how to connect to the payever **open sandbox**. No account is required to use the sandbox — you can get started with the published test credentials. A **production** account, on the other hand, requires you to contact payever.

### What this guide covers

To import the [Postman Collection](mapping_configuration.json), this guide walks you through the following steps:

1. **Create** a payever payment integration in OPF.
2. **Get the credentials** for your payever integration. For the sandbox, you can use the published [payever test credentials](https://docs.payever.org/resources/test-credentials).
3. **Prepare** the [Postman Environment](environment_configuration.json) file so the collection can be imported with all of your OPF tenant and payever sandbox account values.

## Supported Payment Methods

The following ecommerce payment methods (and their issuers) are available via the payever API. Point-of-sale (POS) methods are intentionally excluded, as this collection covers ecommerce only. For full details, see the [payever Payment Methods reference](https://docs.payever.org/api/payments/v3/create-payment/create-payments/payment-methods).

| Method Name | Method Code | Method Issuer | Available Countries |
| --- | --- | --- | --- |
| Openbank Pay BNPL Germany | openbank_pay_bnpl_de | — | DE |
| Openbank Pay BNPL Netherlands | openbank_pay_bnpl | — | NL |
| Openbank Pay BNPL Spain | openbank_pay_bnpl_es | — | ES |
| Openbank Pay Installments Germany | openbank_pay_installment_de | — | DE |
| Openbank Pay Installments Netherlands | openbank_pay_installment | — | NL |
| Openbank Pay Installments Spain | openbank_pay_installment_es | — | ES |
| Openbank Pay Lending Germany | openbank_pay_lending_de | — | DE |
| Openbank Pay Slice-In-Three Germany | openbank_pay_slice_three_de | — | DE |
| Openbank Pay Slice-In-Three Netherlands | openbank_pay_slice_three | — | NL |
| Santander BNPL | santander_invoice_at | — | AT |
| Santander Installments Austria | santander_installment_at | — | AT |
| Santander Installments Belgium | santander_installment_be | — | BE |
| Santander Installments Denmark | santander_installment_dk | — | DK |
| Santander Installments Finland | santander_installment_fi | — | FI |
| Santander Installments Germany | santander_installment | — | DE |
| Santander Installments Netherlands | santander_installment_nl | — | NL |
| Santander Installments Norway | santander_installment_no | — | NO |
| Santander Installments Sweden | santander_installment_se | — | SE |
| Santander Installments United Kingdom | santander_installment_uk | — | UK |
| Santander Invoice Norway | santander_invoice_no | — | NO |
| Santander Pay by Bank | santander_instant | — | AT |
| Verifone Credit Card | credit_card | verifone | DE, DK, ES, FI, NL, NO, PL, SE, UK, AT, BE |
| Verifone Direct Debit | direct_debit | verifone | DE, AT, CH |
| Verifone BNPL | bnpl | verifone | DE, AT |
| Allianz Trade pay | allianz_trade_pay | — | All |
| Apple Pay | apple_pay | verifone, stripe | All |
| Bancontact | bancontact | ppro | BE |
| BFS | bfs | — | DE, CH |
| Bizum | bizum | ppro | ES |
| Blik | blik | ppro | PL |
| Direktüberweisung | instant_payment | — | DE, AT |
| Echocheque | ecocheque | sodexo, monizze, edenred | BE |
| EPS | eps | ppro | AT |
| Google Pay | google_pay | stripe, verifone | All |
| HSBC | hsbc | — | UK |
| Ideal | ideal | ppro, stripe | NL |
| IVY | ivy | — | All |
| Mobile Pay | mobile_pay | swedbank | DK, FI |
| Pay by Bank | pay_by_bank | — | All |
| PAYBACK PAY | payback | — | DE |
| PayPal | paypal | — | All |
| Przelewy24 | przelewy24 | ppro | PL |
| Resurs BNPL | resurs_bnpl | — | DK, FI, NO, SE |
| Resurs Installments | resurs_installments | — | DK, FI, NO, SE |
| SOFORT Banking | sofort | — | DE, AT |
| Stripe Credit Card | credit_card | stripe | All |
| Stripe Direct Debit | direct_debit | stripe | All |
| Swish | swish | — | SE |
| Swedbank Pay Credit Card | swedbank_creditcard | — | DE, DK, FI, NO, SE, AT |
| Swedbank Pay Invoice | swedbank_invoice | — | DE, DK, FI, NO, SE, AT |
| Trustly | trustly | swedbank | SE, FI |
| Twint | twint | ppro | CH |
| Vipps | vipps | swedbank | NO, FI, SE |
| Wero | wero | ppro, stripe | All |
| Wiretransfer | wiretransfer | — | All |

## Step 1 — Create a payever Payment Integration

Create a payever payment integration in the OPF workbench. For reference, see SAP's [Creating Payment Integration](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html) documentation.

> **Note:** The **Merchant ID** is the **Business UUID** provided by payever. For the sandbox, you can use `payever`, as listed in the [sandbox API credentials](https://docs.payever.org/resources/dk/test-credentials/api-credentials/).

## Step 2 — Prepare the `environment_configuration` File

Set the following variables in the Postman environment file.

### 1. Token

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the `access_token` field (it is a JWT) and set it as the `token` value in the environment file.

> **Important:** Ensure the value is prefixed with **Bearer**, e.g. `Bearer {{token}}`.

### 2. Root URL

The `rootUrl` is the **base URL** of your OPF tenant.

For example, if your workbench / OPF cockpit URL was:

```
https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench
```

then the base URL would be:

```
https://opf-iss-d0.uis.commerce.stage.context.cloud.sap
```

### 3. Integration ID and Configuration ID

The `integrationId` and `configurationId` values identify the payment integration and payment configuration. They can be found in the top-left of your **Configuration Details** page in the OPF workbench.

* `integrationId` maps to `accountGroupId` in Postman
* `configurationId` maps to `accountId` in Postman

### 4. clientId

This is the API **Client ID**. For the sandbox environment, it can be obtained [here](https://docs.payever.org/resources/dk/test-credentials/api-credentials/).

### 5. secret

This is the API **Client Secret**. For the sandbox environment, it can be obtained [here](https://docs.payever.org/resources/dk/test-credentials/api-credentials/).

### 6. apiDomain

This configures whether to target the production or sandbox environment:

* `proxy.payever.org` — for **production**
* `proxy.staging.devpayever.com` — for **sandbox**

### 7. paymentMethod

Configure the intended payment method, e.g. `santander_installment`. The list of options is documented [here](https://docs.payever.org/api/payments/create-payment/create-payments).

## Allowlist

Add the following domains to the domain allowlist in the OPF workbench. For instructions, see SAP's [Adding Tenant-specific Domain to Allowlist](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html) documentation.

* `proxy.payever.org` — for the **production** account
* `proxy.staging.devpayever.com` — for the **test** account

## Test Requirements

A payment method is only displayed/available when the order satisfies that method's eligibility rules. These rules differ per payment method — each one can define its own:

* **Amount range** — a minimum and maximum transaction amount.
* **Billing/shipping address restrictions** — e.g. billing and shipping address must match.
* **Country restriction** — the method is only offered in specific countries.
* **Currency restriction** — the method only supports specific currencies.

For the exact conditions of each payment method, refer to the [payever Payments documentation](https://docs.payever.org/payments).

## Summary

The environment file is now ready to be imported into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables:

### Common

* `token`
* `rootUrl`
* `accountGroupId`
* `accountId`

### payever-Specific

* `clientId`
* `secret`
* `merchantId`
* `apiDomain`
* `paymentMethod`
