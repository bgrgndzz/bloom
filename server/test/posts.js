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

describe('/posts/', () => {
  beforeEach(done => {
    Post.deleteMany({}).exec(done);
  });
  
  describe('GET /posts/list', () => {
    it('should list posts', done => {
      login((err, jwt) => {
        createPost((err, post) => {
          chai.request(app)
            .get('/posts/list/topic')
            .set('x-access-token', jwt)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(200);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.have.property('posts');
              res.body.should.not.have.property('error');
              res.body.authenticated.should.be.true;
              res.body.posts.should.not.have.lengthOf(0);
              done();
            });
        });
      });
    });
    it('should not list posts with an invalid topic', done => {
      login((err, jwt) => {
        createPost((err, post) => {
          chai.request(app)
            .get('/posts/list/not-topic')
            .set('x-access-token', jwt)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(422);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.not.have.property('posts');
              res.body.should.have.property('error');
              res.body.authenticated.should.be.true;
              done();
            });
        });
      });
    });
    it('should not list posts if the user is not authenticated', done => {
      createPost((err, post) => {
        chai.request(app)
          .get('/posts/list/topic')
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(403);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('posts');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
    });
  });

  describe('POST /posts/create', () => {
    it('should create a post', done => {
      login((err, jwt) => {
        chai.request(app)
          .post('/posts/create/topic')
          .set('x-access-token', jwt)
          .send({
            text: 'post'
          })
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('error');
            res.body.authenticated.should.be.true;
            done();
          });
      });
    });
    it('should not create a post without a text', done => {
      login((err, jwt) => {
        chai.request(app)
          .post('/posts/create/topic')
          .set('x-access-token', jwt)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.true;
            done();
          });
      });
    });
    it('should not create a post if the user is not authenticated', done => {
      chai.request(app)
        .post('/posts/create/topic')
        .send({
          text: 'post'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(403);
          should.exist(res.body);
          Object.keys(res.body).should.not.have.lengthOf(0);
          res.body.should.have.property('authenticated');
          res.body.should.have.property('error');
          res.body.authenticated.should.be.false;
          done();
        });
    });
  });
});