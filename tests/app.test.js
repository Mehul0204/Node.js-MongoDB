const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust path if needed

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Health Check', () => {
  it('GET /health should return status OK', (done) => {
    chai.request(app)
      .get('/health')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status').equal('OK');
        done();
      });
  });
});
