// Example for `pages/success.tsx`
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SuccessPage = () => {
    const router = useRouter();
    const { session_id } = router.query;

    useEffect(() => {
        const fetchSessionDetails = async () => {
            if (session_id) {
                const response = await fetch(
                    `/api/retrieve-session?session_id=${session_id}`
                );
                const sessionData = await response.json();
                console.log('Session Data:', sessionData);
                // {
                //     "id": "cs_test_a1ewwvzyAglhqH17FmbwwwyQgxIWA9am28zG8cI23ZKKJ6mTkvjVBTzrf6",
                //     "object": "checkout.session",
                //     "adaptive_pricing": {
                //         "enabled": false
                //     },
                //     "after_expiration": null,
                //     "allow_promotion_codes": null,
                //     "amount_subtotal": 200,
                //     "amount_total": 200,
                //     "automatic_tax": {
                //         "enabled": false,
                //         "liability": null,
                //         "status": null
                //     },
                //     "billing_address_collection": null,
                //     "cancel_url": "http://localhost:3000/cancel",
                //     "client_reference_id": null,
                //     "client_secret": null,
                //     "consent": null,
                //     "consent_collection": null,
                //     "created": 1731987632,
                //     "currency": "usd",
                //     "currency_conversion": null,
                //     "custom_fields": [],
                //     "custom_text": {
                //         "after_submit": null,
                //         "shipping_address": null,
                //         "submit": null,
                //         "terms_of_service_acceptance": null
                //     },
                //     "customer": null,
                //     "customer_creation": "if_required",
                //     "customer_details": {
                //         "address": {
                //             "city": null,
                //             "country": "CA",
                //             "line1": null,
                //             "line2": null,
                //             "postal_code": "V6J 4J2",
                //             "state": null
                //         },
                //         "email": "wang.xuyang0602@gmail.com",
                //         "name": "sss",
                //         "phone": null,
                //         "tax_exempt": "none",
                //         "tax_ids": []
                //     },
                //     "customer_email": null,
                //     "expires_at": 1732074032,
                //     "invoice": null,
                //     "invoice_creation": {
                //         "enabled": false,
                //         "invoice_data": {
                //             "account_tax_ids": null,
                //             "custom_fields": null,
                //             "description": null,
                //             "footer": null,
                //             "issuer": null,
                //             "metadata": {},
                //             "rendering_options": null
                //         }
                //     },
                //     "livemode": false,
                //     "locale": null,
                //     "metadata": {},
                //     "mode": "payment",
                //     "payment_intent": "pi_3QMiJL04IhrAMvjm1teo7YB0",
                //     "payment_link": null,
                //     "payment_method_collection": "if_required",
                //     "payment_method_configuration_details": null,
                //     "payment_method_options": {
                //         "card": {
                //             "request_three_d_secure": "automatic"
                //         }
                //     },
                //     "payment_method_types": [
                //         "card"
                //     ],
                //     "payment_status": "paid",
                //     "phone_number_collection": {
                //         "enabled": false
                //     },
                //     "recovered_from": null,
                //     "saved_payment_method_options": null,
                //     "setup_intent": null,
                //     "shipping_address_collection": null,
                //     "shipping_cost": null,
                //     "shipping_details": null,
                //     "shipping_options": [],
                //     "status": "complete",
                //     "submit_type": null,
                //     "subscription": null,
                //     "success_url": "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
                //     "total_details": {
                //         "amount_discount": 0,
                //         "amount_shipping": 0,
                //         "amount_tax": 0
                //     },
                //     "ui_mode": "hosted",
                //     "url": null
                // }
                // Handle the session data (e.g., display confirmation, etc.)
            }
        };

        fetchSessionDetails();
    }, [session_id]);

    return <div>Payment Successful!</div>;
};

export default SuccessPage;
