var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//schema
      var EmployeeSchema = new mongoose.Schema ({
        firstname : {
            type: String
            //required:true
        },
        lastname : {
            type: String
            //required:true
        },
        email:{
            type:String
            //required:true
        },
        dob:{
            type:String
           // required:true
        },
        doj:{
            type:String
           // required:true
        },
        pan:{
            type:Number,
            //required:true
        },
        aadhar:{
            type:Number,
            //required:true
        },
        address:{
            type:String,
            //required:true
        },
        city:{
            type:String,
            //required:true
        },
        state:{
            type:String,
            //required:true
        },
        zipcode:{
            type:Number,
            //required:true
        },
        lastemployeename:{
            type:String,
            //required:true
        },
        hsc:{
            type:Number,
            //required:true
        },
        ssc:{
            type:Number,
            //required:true
        },
        emergencycontact:{
              type:Number
              //required:true  
        }

     })
     var Register = mongoose.model('employees',EmployeeSchema ); //collection employees in employee database 
module.exports = Register;