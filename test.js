
            paypal.Button.render({
    
                env: 'sandbox', // sandbox | production
    
                // PayPal Client IDs - replace with your own
                // Create a PayPal app: https://developer.paypal.com/developer/applications/create
                client: {
                    sandbox:    'AbPBUW5jh3CZJmb2DwFd5Tw4DHzH1UwKVh9-vFuYNRN7Ex3QcqX3mZMeFFCk_ZQuyiaSeGvCi8BElbh4',
                    production: 'AbPBUW5jh3CZJmb2DwFd5Tw4DHzH1UwKVh9-vFuYNRN7Ex3QcqX3mZMeFFCk_ZQuyiaSeGvCi8BElbh4'
                },
    
                // Show the buyer a 'Pay Now' button in the checkout flow
                commit: true,
    
                // payment() is called when the button is clicked
                payment: function(data, actions) {
    
                    // Make a call to the REST api to create the payment
                    return actions.payment.create({
                        payment: {
                            transactions: [
                                {
                                    amount: { total: $("#total").text(), currency: 'USD' }
                                }
                            ],
                            redirect_urls: {
                                return_url: "https://webdevyongjie-ja0b.c9users.io/menu"
                            }
                        }
                    });
                },
                
                // onAuthorize() is called when the buyer approves the payment
                onAuthorize: function(data, actions) {
    
                    // Make a call to the REST api to execute the payment
                         window.alert('Payment Complete!');
                         return actions.redirect();
                }
    
            }, '#paypal-button-container');
