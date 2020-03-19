const Employee = require('../employee.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Marketing'});
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Managment'});
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 1;
      expect(employees.length).to.be.equal(expectedLength);
    }); 

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'Marketing' });
      const expectedFirstName = 'John';
      expect(employee.firstName).to.be.equal(expectedFirstName);
      const expectedLastName = 'Doe';
      expect(employee.lastName).to.be.equal(expectedLastName);
      const expectedDepartment = 'Marketing';
      expect(employee.department).to.be.equal(expectedDepartment);
    }); 

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Marketing' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Marketing'});
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Managment'});
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John', lastName: 'Doe', department: 'Marketing' },
       { $set: { firstName: '=John=', lastName: '=Doe=', department: '=Marketing=' }});
      const updatedEmployee = await Employee.findOne({ firstName: '=John=',
      lastName: '=Doe=', department: '=Marketing=' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'Marketing' });
      employee.firstName = '=John=';
      employee.lastName = '=Doe=';
      employee.department = '=Marketing=';
      await employee.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: '=John=', lastName: '=Doe=', department: '=Marketing=' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'John!', lastName: 'Doe!', department: 'Marketing!' }});
      const employees = await Employee.find({ firstName: 'John!', lastName: 'Doe!', department: 'Marketing!' });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Marketing'});
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Managment'});
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John', lastName: 'Doe', department: 'Marketing' });
      const removeEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'Marketing' });
      expect(removeEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'Marketing' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'Marketing' });
      expect(removedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const removeEmployee = await Employee.find();
      expect(removeEmployee.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  
  });

});