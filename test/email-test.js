const sendmail = require('sendmail')();
 
sendmail({
    from: 'no-reply@yourdomain.com',
    to: 'jefeish@github.com ',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
