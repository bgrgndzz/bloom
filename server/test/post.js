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
const likePost = (postId, jwt, callback) => {
  chai.request(app)
    .post('/post/like/' + postId)
    .set('x-access-token', jwt)
    .end(callback);
};
const unlikePost = (postId, jwt, callback) => {
  chai.request(app)
    .post('/post/unlike/' + postId)
    .set('x-access-token', jwt)
    .end(callback);
};

const isPostLiked = (postId, callback) => {
  Post
    .findById(postId)
    .exec((err, post) => {
      if (err) return callback(err);
      User.findOne({'auth.email': 'johndoe@email.com'}, (err, user) => {
        if (err) return callback(err);
        callback(null, user.id.toString() == post.likes[0]);
      });
    })
};

describe('/post/', () => {
  beforeEach(done => {
    Post.deleteMany({}).exec(done);
  });
  
  describe('POST /post/like/:post', () => {
    it('should like post', done => {
      login((err, jwt) => {
        createPost((err, post) => {
          likePost(post.id, jwt, (err, res) => {
            isPostLiked(post.id, (err, liked) => {
              should.not.exist(err);
              res.should.have.status(200);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.have.property('liked');
              res.body.should.not.have.property('error');
              res.body.authenticated.should.be.true;
              res.body.liked.should.be.true;
              liked.should.be.true;
              done();
            });
          });
        });
      });
    });
    it('should not like post if it doesn\'t exist', done => {
      login((err, jwt) => {
        likePost('not-a-post', jwt, (err, res) => {
          should.not.exist(err);
          res.should.have.status(422);
          should.exist(res.body);
          Object.keys(res.body).should.not.have.lengthOf(0);
          res.body.should.have.property('authenticated');
          res.body.should.not.have.property('liked');
          res.body.should.have.property('error');
          res.body.authenticated.should.be.true;
          done();
        });
      });
    });
    it('should not like post if the user is not authenticated', done => {
      createPost((err, post) => {
        likePost(post.id, null, (err, res) => {
          isPostLiked(post.id, (err, liked) => {
            should.not.exist(err);
            res.should.have.status(403);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('liked');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            liked.should.be.false;
            done();
          });
        });
      });
    });
  });

  describe('POST /post/unlike/:post', () => {
    it('should unlike post', done => {
      login((err, jwt) => {
        createPost((err, post) => {
          likePost(post.id, jwt, (err, res) => {
            unlikePost(post.id, jwt, (err, res) => {
              isPostLiked(post.id, (err, liked) => {
                should.not.exist(err);
                res.should.have.status(200);
                should.exist(res.body);
                Object.keys(res.body).should.not.have.lengthOf(0);
                res.body.should.have.property('authenticated');
                res.body.should.have.property('liked');
                res.body.should.not.have.property('error');
                res.body.authenticated.should.be.true;
                res.body.liked.should.be.false;
                liked.should.be.false;
                done();
              });
            });
          });
        });
      });
    });
    it('should not unlike post if it doesn\'t exist', done => {
      login((err, jwt) => {
        likePost('not-a-post', jwt, (err, res) => {
          should.not.exist(err);
          res.should.have.status(422);
          should.exist(res.body);
          Object.keys(res.body).should.not.have.lengthOf(0);
          res.body.should.have.property('authenticated');
          res.body.should.not.have.property('liked');
          res.body.should.have.property('error');
          res.body.authenticated.should.be.true;
          done();
        });
      });
    });
    it('should not unlike post if the user is not authenticated', done => {
      login((err, jwt) => {
        createPost((err, post) => {
          likePost(post.id, jwt, (err, res) => {
            unlikePost(post.id, null, (err, res) => {
              isPostLiked(post.id, (err, liked) => {
                should.not.exist(err);
                res.should.have.status(403);
                should.exist(res.body);
                Object.keys(res.body).should.not.have.lengthOf(0);
                res.body.should.have.property('authenticated');
                res.body.should.not.have.property('liked');
                res.body.should.have.property('error');
                res.body.authenticated.should.be.false;
                liked.should.be.true;
                done();
              });
            });
          });
        });
      });
    });
  });
});