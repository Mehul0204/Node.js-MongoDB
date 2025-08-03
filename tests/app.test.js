const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');

// Adjust the path to server.js based on your actual structure
const app = require(path.join(__dirname, '../server'));

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Tests', () => {
  it('should return health status', (done) => {
    chai.request(app)
      .get('/health')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status').equal('OK');
        done();
      });
  });
});
