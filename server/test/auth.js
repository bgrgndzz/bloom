const mongoose = require("mongoose");
const User = require('../models/User/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');
const should = chai.should();


chai.use(chaiHttp);

describe('/auth/', () => {
  beforeEach(done => {
    User.deleteMany({}).exec(done);        
  });

  describe('POST /auth/login', () => {
    it('should login', done => {
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
        const formData = {
          email: 'johndoe@email.com',
          password: 'password'
        };
        chai.request(app)
          .post('/auth/login')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.have.property('jwt');
            res.body.should.not.have.property('error');
            res.body.authenticated.should.be.true;
            done();
          });
      });
    });
    describe('invalid credentials', () => {
      it('should not login with a wrong password', done => {
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
          const formData = {
            email: 'johndoe@email.com',
            password: 'not password'
          };
          chai.request(app)
            .post('/auth/login')
            .send(formData)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(422);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.not.have.property('jwt');
              res.body.should.have.property('error');
              res.body.authenticated.should.be.false;
              done();
            });
        });
      });
      it('should not login with an invalid email', done => {
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
          const formData = {
            email: 'notjohndoe',
            password: 'password'
          };
          chai.request(app)
            .post('/auth/login')
            .send(formData)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(422);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.not.have.property('jwt');
              res.body.should.have.property('error');
              res.body.authenticated.should.be.false;
              done();
            });
        });
      });
    });
    describe('missing parameters', () => {
      it('should not login with a missing email parameter', done => {
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
          const formData = {
            password: 'password'
          };
          chai.request(app)
            .post('/auth/login')
            .send(formData)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(422);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.not.have.property('jwt');
              res.body.should.have.property('error');
              res.body.authenticated.should.be.false;
              done();
            });
        });
      });
      it('should not login with a missing password parameter', done => {
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
          const formData = {
            email: 'johndoe@email.com'
          };
          chai.request(app)
            .post('/auth/login')
            .send(formData)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(422);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.not.have.property('jwt');
              res.body.should.have.property('error');
              res.body.authenticated.should.be.false;
              done();
            });
        });
      });
      it('should not login with both parameters missing', done => {
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
          chai.request(app)
            .post('/auth/login')
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(422);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.not.have.property('jwt');
              res.body.should.have.property('error');
              res.body.authenticated.should.be.false;
              done();
            });
        });
      });
    });
    it('should not login an inactive user', done => {
      const user = new User({
        auth: {
          email: 'johndoe@email.com',
          password: 'password',
          active: false
        },
        user: {
          firstName: 'john',
          lastName: 'doe',
          school: 'johndoe college'
        }
      });
      user.save(err => {
        const formData = {
          email: 'johndoe@email.com',
          password: 'password'
        };
        chai.request(app)
          .post('/auth/login')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('jwt');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
    });
  });
  describe('POST /auth/register', () => {
    it('should register', done => {
      const formData = {
        firstName: 'john',
        lastName: 'doe',
        email: 'johndoe@email.com',
        school: 'Robert College',
        password: 'password',
        password2: 'password'
      };
      chai.request(app)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          should.exist(res.body);
          Object.keys(res.body).should.not.have.lengthOf(0);
          res.body.should.have.property('authenticated');
          res.body.should.have.property('jwt');
          res.body.should.not.have.property('error');
          res.body.authenticated.should.be.true;
          done();
        });
    });
    describe('missing parameters', () => {
      it('should not register with a missing firstName', done => {
        const formData = {
          lastName: 'doe',
          email: 'johndoe@email.com',
          school: 'Robert College',
          password: 'password',
          password2: 'password'
        };
        chai.request(app)
          .post('/auth/register')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('jwt');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
      it('should not register with a missing lastName', done => {
        const formData = {
          firstName: 'john',
          email: 'johndoe@email.com',
          school: 'Robert College',
          password: 'password',
          password2: 'password'
        };
        chai.request(app)
          .post('/auth/register')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('jwt');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
      it('should not register with a missing email', done => {
        const formData = {
          firstName: 'john',
          lastName: 'doe',
          school: 'Robert College',
          password: 'password',
          password2: 'password'
        };
        chai.request(app)
          .post('/auth/register')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('jwt');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
      it('should not register with a missing school', done => {
        const formData = {
          firstName: 'john',
          lastName: 'doe',
          email: 'johndoe@email.com',
          password: 'password',
          password2: 'password'
        };
        chai.request(app)
          .post('/auth/register')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('jwt');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
      it('should not register with a missing password', done => {
        const formData = {
          firstName: 'john',
          lastName: 'doe',
          email: 'johndoe@email.com',
          school: 'Robert College',
          password2: 'password'
        };
        chai.request(app)
          .post('/auth/register')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('jwt');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
      it('should not register with a missing password2', done => {
        const formData = {
          firstName: 'john',
          lastName: 'doe',
          email: 'johndoe@email.com',
          school: 'Robert College',
          password: 'password'
        };
        chai.request(app)
          .post('/auth/register')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('jwt');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
    });
    describe('invalid parameters', () => {
      it('should not register with password and password2 not matching', done => {
        const formData = {
          firstName: 'john',
          lastName: 'doe',
          email: 'johndoe@email.com',
          school: 'Robert College',
          password: 'password',
          password2: 'not password'
        };
        chai.request(app)
          .post('/auth/register')
          .send(formData)
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(422);
            should.exist(res.body);
            Object.keys(res.body).should.not.have.lengthOf(0);
            res.body.should.have.property('authenticated');
            res.body.should.not.have.property('jwt');
            res.body.should.have.property('error');
            res.body.authenticated.should.be.false;
            done();
          });
      });
      it('should not register with an already existing email', done => {
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
          const formData = {
            firstName: 'john',
            lastName: 'doe',
            email: 'johndoe@email.com',
            school: 'Robert College',
            password: 'password',
            password2: 'password'
          };

          chai.request(app)
            .post('/auth/register')
            .send(formData)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(422);
              should.exist(res.body);
              Object.keys(res.body).should.not.have.lengthOf(0);
              res.body.should.have.property('authenticated');
              res.body.should.not.have.property('jwt');
              res.body.should.have.property('error');
              res.body.authenticated.should.be.false;
              done();
            });
        });
      });
    });
  });
});