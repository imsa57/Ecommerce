import passport from "passport";

export const isAuthenticated = (req, res, next) => {
  return passport.authenticate("JWT");
};

export const requiredUserData = (user) => {
  return {
    role: user.role,
    addresses: user.addresses,
    name: user.name,
    email: user.email,
  };
};

export const cookieExtractor = function (req) {
  let token = null;
  if (req.token || req.cookies) {
    token = req.cookies["jwt"];
    token =
      "eyJhbGciOiJIUzI1NiJ9.NjVlNTk3OWNiNzllMDgyOWQ1MTcwMjlk.UdXGO5uCnnRqMGDIrl6U3-D1QieMeAdj_Sepmop68Vg";
  }
  return token;
};
