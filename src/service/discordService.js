const axios = require('axios');
const DB = require('../helpers/connect-db')
const verifyJoinChanel = require('../models/verifyJoinChannel')


class DiscordService {
  static oauth2 = async (code) => {
    if (code) {
      const formData = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code.toString(),
        redirect_uri: "http://localhost:3001/quest-admin.test",
      });

      const output = await axios.post("https://discord.com/api/v10/oauth2/token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (output.data) {
        const access = output.data.access_token;
        const userinfo = await axios.get("https://discord.com/api/v10/users/@me", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        return {
          code: 200,
          metadata: userinfo.data
        };
      }
    }
  };

  static verifyJoinChanel = async(id) => {
    const infoAccount = await DB.query(verifyJoinChanel(id))
    if (infoAccount.rowCount > 0) {
      return {
        joined: true
      }
    }

    return {
      joined: false
    }
  }
}

module.exports = DiscordService;
