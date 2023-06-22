const { sign, verify } = require('jsonwebtoken');

class jsonwebtoken {
  static sign(user, secret) {
    const payload = {
      uuid: user.uuid,
      nickname: user.nickname,
    };

    return sign(payload, secret, {
      expiresIn: '3d',
    });
  }

  static verify(token, secret) {
    try {
      const decode = verify(token, secret);

      return {
        success: true,
        message: '',
        uuid: decode.uuid,
        nickname: decode.nickname,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}

module.exports = jsonwebtoken;