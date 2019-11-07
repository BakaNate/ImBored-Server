class Constants {
  constructor() {
    this.MAIL = 'poc.newsletters@gmail.com';
    this.MAIL_PASS = '1poc2fou';
    this.MAIL_FROM = 'ImBored@ImBored.com';
    this.MAIL_SUBJECT = 'Votre compte ImBored';
    this.MAIL_TEXT = 'Bienvenue sur ImBored votre compte a bien été créé';

    this.PORT_DEV = 3080;

    this.DB_URI = 'mongodb://localhost/imBored';
    this.DB_URI_DEV = 'mongodb://localhost:27017/imBored-dev';

    this.SECRET = 'thisIs4SecretKey@';
  }
}

module.exports = Constants;
