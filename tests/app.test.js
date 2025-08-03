const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server'); // Make sure your server.js exports the app

// Configure chai
chai.use(chaiHttp);
const expect = chai.expect;

// Test data
const TEST_PORT = 3001;
let server;

describe('API Tests', function() {
  // Increase timeout for Jenkins environment
  this.timeout(10000);

  before(async () => {
    // Start server on test port
    server = app.listen(TEST_PORT, () => {
      console.log(`Test server running on port ${TEST_PORT}`);
    });

    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  });

  after(async () => {
    // Close server
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }

    // Close database connection if using Mongoose
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe('Health Check', () => {
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

  // Add more test suites here
  describe('Todo API', () => {
    let testTodoId;

    before(async () => {
      // Seed test data if needed
      // await TodoModel.create({ title: 'Test todo' });
    });

    after(async () => {
      // Clean up test data
      // await TodoModel.deleteMany({});
    });

    it('POST /api/todos should create a new todo', (done) => {
      chai.request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo', completed: false })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('_id');
          expect(res.body.title).to.equal('Test Todo');
          testTodoId = res.body._id;
          done();
        });
    });

    it('GET /api/todos should return all todos', (done) => {
      chai.request(app)
        .get('/api/todos')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    // Add more todo tests here
  });
});
