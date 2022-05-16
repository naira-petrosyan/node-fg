require('./mongoose');

let MemberModel = require('./member')
let member = new MemberModel({
   first_name: 'Narek',
    last_name: 'Okroyan',
    is_contributing: false,
    email: 'narek.okroyan@fluxtechs.com'
});

/*member.save()
    .then(doc => {
        console.log(doc);
        process.exit(0);
    })
    .catch(err => {
        console.error(err)
        process.exit(0);
    })*/


MemberModel
    .find({
        email: 'narek.okroyan@fluxtechs.com'   // search query
    })
    .then(doc => {
        console.log(doc);
        process.exit(0);
    })
    .catch(err => {
        console.error(err)
        process.exit(0);
    })