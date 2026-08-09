const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const responeHandler = require("../utils/responseHandler");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return responeHandler(res, 400, "Email and password are required");
    }
    const users = await userService.getAllUsers();
    const user = users.find(
      (user) => user.email === email && user.password === password,
    );
    if (!user) {
      return responeHandler(res, 401, "Invalid email or password");
    }
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "Your-Secret-key",
      { expiresIn: "24h" },
    );
    return responeHandler(res, 200, "Login successfully", {
      user: { id: user.id, name: user.name, email: user.email, role: user.role},
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return responeHandler(res, 400, "Name, email and password are required");
    }
    const users = await userService.getAllUsers();
    if (users.find((user) => user.email === email)) {
      return responeHandler(res, 400, "Email already exists");
    }
    const newUser = await userService.createUser({
      name,
      email,
      password,
      role: "user",
    });
    return responeHandler(res, 201, "Register successfully", {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
};
