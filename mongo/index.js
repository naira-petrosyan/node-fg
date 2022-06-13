require('./mongoose');

let MemberModel = require('./member')
let member = new MemberModel({
   first_name: 'Naira',
    last_name: 'Petrosyan',
    is_contributing: true,
    email: 'naira.petrosyan@fluxtechs.com'
});
// member.save()
//     .then(doc => {
//         console.log(doc);
//         process.exit(0);
//     })
//     .catch(err => {
//         console.error(err)
//         process.exit(0);
//     })


// MemberModel
//     .find({
//         email: 'narek.okroyan@fluxtechs.com'   // search query
//     })
//     .then(doc => {
//         console.log(doc);
//         process.exit(0);
//     })
//     .catch(err => {
//         console.error(err)
//         process.exit(0);
//     })

MemberModel
    .updateMany({
        first_name: 'Naira'
    }, {
        email: 'narek.okroyan@fluxtechs.com'
    }, {
        runValidators: true,
    })
    .then(doc => {
        console.log(doc);
        process.exit(0);
    })
    .catch(err => {
        console.error(err)
        process.exit(0);
    })
