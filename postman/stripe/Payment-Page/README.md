## Introduction ## 
The Postman Collection enables a [Stripe Hosted Checkout](https://docs.stripe.com/checkout/quickstart) integration for payment processing through open payment framework(OPF).

The integration supports:

* Authorization of Card Payments using PCI SAQ-A Stripe Checkout using the OPF "Payment Page" UX pattern
* Deferred Capture support
* Refunds
* Reversals
* Recurrent Authorization

In summary: to import the [Stripe Hosted Page Postman Collection](Stripe-Hosted_Page_mapping_configuration.json) this page will guide you through the following steps: 

a) Create your Stripe test account.

b) Create a Stripe payment integration in OPF workbench.

c) Set up your Stripe test account to work with OPF.

d) Prepare the [Postman Environment](Stripe-Hosted_Page_environment_configuration.json) file so the collection can be imported with all your OPF tenant and Stripe test account unique values. 

## Creating a Stripe Account ##
You can sign up for a free Stripe test account at https://dashboard.stripe.com/register.


### Creating a Stripe Payment Integration ###
Create a Stripe payment integration in the OPF workbench. For reference, see [Creating Payment Integration
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

## Preparing the Postman environment_configuration file

**1. Token**

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the access_token field (it’s a JWT) and set as the ``token`` value in the environment file.

**IMPORTANT**: Ensure the value is prefixed with **Bearer**. e.g. ``Bearer {{token}}``.

**2. Root url**

The ``rootUrl`` is the **BASE URL** of your OPF tenant.

E.g. if your workbench/OPF cockpit url was this …

<https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench>

The base Url would be

https://opf-iss-d0.uis.commerce.stage.context.cloud.sap

**3. Integration ID and Configuration ID**

The ``integrationId`` and ``configurationId`` values identify the payment integration and payment configuration, which can be found in the top left of your **Configuration Details** page in the OPF workbench.

* ``integrationId`` maps to ``accountGroupId`` in Postman
* ``configurationId`` maps to ``accountId`` in Postman

**4. API Keys**

The Publishable Key and Restricted Key (used as Secret Key) are obtained via the [SAP OPF Stripe Integration](https://marketplace.stripe.com/apps/open-payment-framework-integration) app, available on the Stripe App Marketplace.
![app_marketplace](images/opf-payment-framework-integration-app-in-marketplace.png)
1. Install the SAP OPF Stripe Integration app.
2. Click the **"View API Keys"** button in the upper right corner of the app.
![app_api_key](images/opf-payment-framework-integration-app-api-key.png)
1. Copy both your **Publishable Key** (starts with ``pk_test``) and the generated **Restricted Key** (starts with ``rk_test``).

``Publishable Key`` maps to ``publicKey`` in Postman
``Restricted Key`` maps to ``secretKey`` in Postman

> **Note**: To rotate the Restricted Key, navigate to **Developers → API Keys** in the Stripe Dashboard. In the **Restricted keys** section, find the key named "Key for com.stripe.open-payment-framework-integration" with the App tag, click the three-dot menu, and select **Rotate**.

**6. Webhook Secret**

IN OPF Workbench: For your new Stripe payment integration, navigate to the **General Information** section of the **Integration details** tab to copy the Notification URL.

In Stripe Dashboard: Navigate to <https://dashboard.stripe.com/test/webhooks> and click **Add an Endpoint**.

i) Paste in your endpoint URL copied from OPF.

![](images/stripe-elements-paste-webook.png)

ii) For simplicity, select **All events**.

![](images/stripe-elements-select-events.png)

iii) Click **Add Endpoint**.

![](images/stripe-elements-add-endpoint.png)

iv) Click **Reveal** to get the webhook secret, it starts with **whsec**.

![](images/stripe-elements-reveal-whsecret.png)

v) In the environment file, set the ``webhookSecret`` value to the key starting with **whsec_**.

## Allowlist ##
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``api.stripe.com``
``a.stripecdn.com``
``api.stripe.com``
``atlas.stripe.com``
``auth.stripe.com``
``b.stripecdn.com``
``billing.stripe.com``
``buy.stripe.com``
``c.stripecdn.com``
``checkout.stripe.com``
``climate.stripe.com``
``connect.stripe.com``
``dashboard.stripe.com``
``express.stripe.com``
``files.stripe.com``
``hooks.stripe.com``
``invoice.stripe.com``
``invoicedata.stripe.com``
``js.stripe.com``
``m.stripe.com``
``m.stripe.network``
``manage.stripe.com``
``pay.stripe.com``
``payments.stripe.com``
``q.stripe.com``
``qr.stripe.com``
``r.stripe.com``
``verify.stripe.com``
``stripe.com``
``terminal.stripe.com``
``uploads.stripe.com``

## Summary ##

The environment file is now ready for importing into postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary you should have edited the following variables:

- **token** https://github.com/opf-postman/commerce-cloud-open-payment-integration/blob/main/postman/stripe/Payment-Page/Stripe-Hosted_Page_environment_configuration.json#L6
- **rootUrl** https://github.com/opf-postman/commerce-cloud-open-payment-integration/blob/main/postman/stripe/Payment-Page/Stripe-Hosted_Page_environment_configuration.json#L11
- **accountGroupId** https://github.com/opf-postman/commerce-cloud-open-payment-integration/blob/main/postman/stripe/Payment-Page/Stripe-Hosted_Page_environment_configuration.json#L21
- **accountId** https://github.com/opf-postman/commerce-cloud-open-payment-integration/blob/main/postman/stripe/Payment-Page/Stripe-Hosted_Page_environment_configuration.json#L26
- **publickey** https://github.com/opf-postman/commerce-cloud-open-payment-integration/blob/main/postman/stripe/Payment-Page/Stripe-Hosted_Page_environment_configuration.json#L73
- **webhookSecret** https://github.com/opf-postman/commerce-cloud-open-payment-integration/blob/main/postman/stripe/Payment-Page/Stripe-Hosted_Page_environment_configuration.json#L85
