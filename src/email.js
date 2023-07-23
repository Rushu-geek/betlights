const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey('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');


export const sendEmail = () => {

    const msg = {
        to: 'rushabh@mailinator.com',
        from: 'betlightsweb@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sendgrid.send(msg).then((m) => console.log(m)).catch((e) => console.log(e));

}