const request = require('request-promise');

class Token {

    constructor(config) {
        this.config = config;
        this.started = true;
        this.value = null;
        this.expirar = 30; //min
        this.countNewToken = 0;
    }

    async get() {
        if (!this.value || this.expired)
            this.value = await this.newToken();
        return this.value;
    }

    async newToken() {
        let options = {
            method: 'POST',
            uri: 'https://bitbucket.org/site/oauth2/access_token/',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                'grant_type': 'password',
                'username': this.config.username,
                'password': this.config.password,
                'client_id': this.config.client_id,
                'client_secret': this.config.client_secret
            },
            json: true
        };

        try {
            let auth = await request(options);
            this.getDates();
            this.countNewToken = 0;
            return auth.access_token;
        } catch (error) {
            /* TRATAR TOKEN EXPIRADO CASO VOLTE ESSA MESSAGE */
            if (this.countNewToken < 3) {
                this.countNewToken++;
                this.value = null;
                return await this.get();
            }
            this.countNewToken++;
            throw error;
        }

    }

    getDates() {
        this.date = new Date();
        this.dateExpired = new Date();
        this.dateExpired.setMinutes(this.dateExpired.getMinutes() + this.expirar);
    }

    get expired() {
        var now = new Date();
        return now > this.dateExpired;
    }
}

module.exports = Token;

