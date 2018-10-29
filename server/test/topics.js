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
const createPost = (callback) => {
  User.findOne({'auth.email': 'johndoe@email.com'}, (err, userRes) => {
    if (err) return callback(err);

    const newPost = new Post({
      text: 'post',
      topic: 'topic',
      author: userRes.id
    });
    newPost.save(err => {
      if (err) return callback(err);
      callback(null, newPost);
    });
  });
};

describe('/topics/', () => {
  beforeEach(done => {
    Post.deleteMany({}).exec(done);
  });
  
  describe('GET /topics/list', () => {
    it('should list topics', done => {
      login((err, jwt) => {
        createPost((err, post) => {
          chai.request(app)
            .get('/topics/list/')
            .set('x-access-token', jwt)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(200);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.have.property('topics');
              res.body.should.not.have.property('error');
              res.body.authenticated.should.be.true;
              res.body.topics.should.not.have.lengthOf(0);
              done();
            });
        });
      });
    });
    it('should not list posts if the user is not authenticated', done => {
      createPost((err, post) => {
        chai.request(app)
          .get('/topics/list/')
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(403);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('topics');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
    });
  });
});