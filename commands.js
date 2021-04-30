const utils = require('./utils')
const axios = require('axios')
const dotenv = require('dotenv');
const apis = require('./apis.js')
const pjson = require('./package.json')

dotenv.config()

const request_options = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.USER_TOKEN}`,
  }
}

module.exports = [
  {
    message: "hello",
    private: false,
    command: (reply_token) => {
      utils.send_response(reply_token,"Hello to you too!");
    }
  },
  {
    message: "version",
    private: false,
    command: (reply_token) => {
      utils.send_response(reply_token,pjson.version);
    }
  },


  {
    message: "weight",
    private: true,
    command: (reply_token) => {

      axios.get(apis.weight_api_url, request_options)
      .then(response => {
        utils.send_response(reply_token,"Current weight: " + response.data.weight+ " kg");
      })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${apis.weight_api_url} : ${error}`);
      })

    }
  },

  {
    message: "current",
    private: true,
    command: (reply_token) => {

      axios.get(apis.current_consumption_api_url, request_options)
      .then(response => {
        utils.send_response(reply_token,`Apartment current consumption: ${response.data.total}A`);
      })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${apis.current_consumption_api_url} : ${error}`);
      })

    }
  },

  {
    message: "solar",
    private: true,
    command: (reply_token) => {

      axios.get(apis.solar_api_url, request_options)
      .then(response => {
        utils.send_response(reply_token,`Current battery voltage: ${response.data.voltage}V`);
      })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${apis.solar_api_url} : ${error}`);
      })

    }
  },
  {
    message: "location",
    private: true,
    command: (reply_token) => {

      axios.get(apis.location_api_url, request_options)
      .then(({data}) => { utils.send_response(reply_token,`Current location: ${data}`); })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${apis.location_api_url} : ${error}`);
      })

    }
  },

  {
    message: "commands",
    private: false,
    command: (reply_token) => {
      let command_list = []
      module.exports.forEach( command => {
        command_list.push(command.message)
      })
      let response = 'Command list: \n'
      response += command_list.join('\n')
      utils.send_response(reply_token,response);

    }
  },

]
