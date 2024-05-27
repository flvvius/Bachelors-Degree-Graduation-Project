const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const {user} = require("../models");

passport.use(new Strategy({
    clientID: "195419556137-5ctqrpk3k3seifpn03jnkcqs2anvhpe7.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8080/api/auth/redirect",
    
}, (accessToken, refreshToken, profile, next) => {
    user.findOne({where: {
        mail: profile.emails[0].value,
    },})
    .then((currentUser) => {
        if (!currentUser) {
            user.create({
                nume: profile.name.givenName + " " + (profile.name.middleName !== undefined ? profile.name.middleName + " " + profile.name.familyName : profile.name.familyName),
                mail: profile.emails[0].value,
                esteAdmin: false,
                apartineFirmei: false,
            })
            .then((user) => {
                next(null, user); //.get()
            })
            .catch((err) => {
                console.log(err);
                next(err);
            });
            
        } else {
            // console.log("intra pe else")
            next(null, currentUser);
        }
    })
    .catch((err) => {
        next(err);
    })


}))

passport.serializeUser((user, next) => {

    // console.log("serialize")
    next(null, user.id);
  });

passport.deserializeUser(async (id, next) => {
    // console.log("deserialize")
    const currentUser = await user.findOne({ where: { id } });
    // if (currentUser)
        next(null, currentUser);
  });