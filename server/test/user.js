const mongoose = require('mongoose');
const Post = require('../models/Post/Post');
const User = require('../models/User/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const app = require('../app.js');

chai.use(chaiHttp);

const login = (callback) => {
  chai.request(app)
    .post('/auth/login')
    .send({
      email: 'johndoe@email.com',
      password: 'password'
    })
    .end((err, res) => {
      if (err) return callback(err);
      callback(null, res.body.jwt);
    });
};
const register = (callback) => {
  const user = new User({
    auth: {
      email: 'johndoe@email.com',
      password: 'password'
    },
    user: {
      firstName: 'john',
      lastName: 'doe',
      school: 'johndoe college'
    }
  });
  user.save(err => {
    if (err) return callback(err);
    login((err, jwt) => {
      if (err) return callback(err);
      callback(null, {
        jwt: jwt,
        id: user.id
      });
    });
  });
};

describe('/user/', () => {
  beforeEach(done => {
    Post.deleteMany({}).exec(() => {
      User.deleteMany({}).exec(done);
    });
  });
  
  describe('GET /user/', () => {
    it('should get info about self', done => {
      register((err, {jwt}) => {
        chai.request(app)
          .get('/user/')
          .set('x-access-token', jwt)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.have.property('user');
            res.body.should.not.have.property('error');
            res.body.authenticated.should.be.true;
            Object.keys(res.body.user).should.not.have.lengthOf(0);
            done();
          });
      });
    });
    it('should not get info about self if the user is not authenticated', done => {
      register((err) => {
        chai.request(app)
          .get('/user/')
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(403);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('user');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
    });
  });
  describe('GET /user/:user', () => {
    it('should get info about user', done => {
      register((err, {jwt, id}) => {
        chai.request(app)
          .get('/user/' + id)
          .set('x-access-token', jwt)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.have.property('user');
            res.body.should.not.have.property('error');
            res.body.authenticated.should.be.true;
            Object.keys(res.body.user).should.not.have.lengthOf(0);
            done();
          });
      });
    });
    it('should not get info about user if the user doesn\'t exist', done => {
      register((err, {jwt}) => {
        chai.request(app)
          .get('/user/not-a-user')
          .set('x-access-token', jwt)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(403);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('user');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.true;
            done();
          });
      });
    });
    it('should not get info about user if the user is not authenticated', done => {
      register((err, {id}) => {
        chai.request(app)
          .get('/user/' + id)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(403);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('user');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
    });
  });
});