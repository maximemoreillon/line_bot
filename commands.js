const utils = require('./utils')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const secrets = require('./secrets');

module.exports = [
  {
    message: "hello",
    private: false,
    command: function(reply_token) {
      utils.send_response(reply_token,"Hello to you too!");
    }
  },
  {
    message: "balance",
    private: true,
    command: (reply_token) => {

      jwt.sign({ service_name: 'line_bot' }, secrets.jwt_secret, (err, token) => {
        if(err) return utils.send_response(reply_token,"there was an error processing the command")
        axios.post(secrets.finances_api_url, {},{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          timeout: 3000,
        })
        .then(response => {
          utils.send_response(reply_token,"Current balance is " + response.data + "円");
        })
        .catch(error => {
          utils.send_response(reply_token,"there was an error processing the command")
          console.log(error)
        })
      });



    }
  },
  {
    message: "weight",
    private: true,
    command: (reply_token) => {
      jwt.sign({ service_name: 'line_bot' }, secrets.jwt_secret, (err, token) => {
        if(err) return utils.send_response(reply_token,"there was an error processing the command")
        axios.post(secrets.weight_api_url, {},{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          timeout: 3000,
        })
        .then(response => {
          utils.send_response(reply_token,"Current weight: " + response.data[0].weight + " kg");
        })
        .catch(error => {
          utils.send_response(reply_token,"there was an error processing the command");
          console.log(error)
        })
      })

    }
  },

]
