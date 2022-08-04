const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;

    //if fields are left blank
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }

    const hash = bcrypt.hashSync(password);

        // stores user email and hashed password into login table
        db.transaction(trx => { 
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')

            // stores other info into users table
            .then(loginEmail => {
                return trx('users')
                    .returning('*') //returning all the columns
                    .insert({
                        email: loginEmail[0].email, //this now returns the email
                        name: name,
                        joined: new Date()
                })
                // return user info
                .then(user => {
                    res.json(user[0]);
               })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
};