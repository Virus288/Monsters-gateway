import getDetails from './details/router';
import login from './login/router';
import refreshToken from './refreshToken/router';
import register from './register/router';
import remove from './remove/router';

const exports = {
  remove: remove.router,
  login: login.router,
  register: register.router,
  getDetails: getDetails.router,
  refreshToken: refreshToken.router,
};

export default exports;
