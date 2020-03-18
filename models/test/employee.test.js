const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  it('should throw an error if no arg', () => {
    const emp = new Employee({}); // create new Employee, but don't set attr value
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName" is not a string', () => {
    const cases = [{}, []];
    for(let firstName of cases) {
      const emp = new Employee({ firstName });
      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
      });
    }
  });

  it('should throw an error if "lastName" is not a string', () => {
    const cases = [{}, []];
    for(let lastName of cases) {
      const emp = new Employee({ lastName });
      emp.validate(err => {
        expect(err.errors.lastName).to.exist;
      });
    }
  });

  it('should throw an error if "department" is not a string', () => {
    const cases = [{}, []];
    for(let department of cases) {
      const emp = new Employee({ department });
      emp.validate(err => {
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if "firstName", "lastName" and "department" is okay', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const department = 'Managment';
    const emp = new Employee({ firstName, lastName, department});
    emp.validate(err => {
      expect(err).to.not.exist;
    });
  });
  
  after(() => {
    mongoose.models = {};
  });

});