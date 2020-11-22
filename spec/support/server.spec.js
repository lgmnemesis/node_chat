require('dotenv').config();
const request = require('request');

const HOST_URL = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;

describe('get messages', () => {
  it('should return 200 OK', (done) => {
    request.get(`${HOST_URL}/messages`, (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    })
  })
})

describe('get message from user', () => {
  it('name should be testUser', (done) => {
    request.get(`${HOST_URL}/messages/testUser`, (err, res) => {
      expect(JSON.parse(res.body)[0].name).toEqual('testUser');
      done();
    })
  })
})