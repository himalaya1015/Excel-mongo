var express = require('express'); 
    var app = express();
    var fs = require('fs'); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var mongoose = require('mongoose');
    var xlstojson = require("xls-to-json-lc");
    var xlsxtojson = require("xlsx-to-json-lc");
    var xlsx = require('node-xlsx');
    var methodOverride = require('method-override');
    var morgan = require('morgan');
    
   app.use(morgan('dev'));                                         
    app.use(bodyParser.urlencoded({'extended':'true'}));            
    app.use(bodyParser.json());                                     
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    app.use(methodOverride());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
//mongodb connection
  mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/employee');
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
    app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        }
    });

    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            // console.log("asd");
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        //console.log(req.file.originalname.split('.')[req.file.originalname.split('.').length-1]);
        var exceltojson;
        upload(req,res,function(err){
            if(err){

                  console.log(err);
                // res.json({error_code:1,err_desc:err});
                    res.json({"message":"The file is not a valid excel sheet"});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            


            // var obj = xlsx.parse(req.file);
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
             if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    // res.json(result);


                    result.forEach(function(row){
                       // console.log(row);
                        new Register({
                        firstname : row.firstname,
                        lastname : row.lastname,
                        email : row.email,
                        dob : row.dob,
                        doj : row.doj,
                        pan : row.pan,
                        aadhar : row.aadhar,
                        address : row.address,
                        city : row.city,
                        state : row.state,
                        zipcode : row.zipcode,
                        lastemployeename : row.lastemployeename,
                        hsc : row.hsc,
                        ssc : row.ssc,
                        emergencycontact : row.emergencycontact
                        }).save(function(err,doc){
                            if(err) console.log(err);
                            //else
                             //   res.render('display.jade',{members:doc})
                           // else res.send('Successfully submitted!');
                            })
                        setTimeout(function(){console.log('your name')},7000);
                    });
                    // for (var i = 0 ; i < result.length; i++) {
                        
                    //     // var data = [];
                    //     // data[firstname] = result[i].FirstName;
                    //     // console.log(result[i].City);
                    //     console.log(i);
                    //     new Register({
                    //     FirstName : result[i].firstname,
                    //     LastName : result[i].lastname,
                    //     email : result[i].email,
                    //     DOB : result[i].dob,
                    //     DOJ : result[i].doj,
                    //     PAN : result[i].pan,
                    //     Aadhar : result[i].aadhar,
                    //     Address : result[i].address,
                    //     City : result[i].city,
                    //     State : result[i].state,
                    //     ZipCode : result[i].zipcode,
                    //     LastEmployeeName : result[i].lastemployeename,
                    //     HSC : result[i].hsc,
                    //     SSC : result[i].ssc,
                    //     EmergencyContact : result[i].emergencycontact
                    //     }).save(function(err,doc){
                    //         if(err) console.log(err);
                    //         else res.send('Successfully submitted!');
                    //         })
                    // }
                    //FOR CHECKING THE EMPLOYEE LIST, REFRESH THE /UPLOAD PAGE.
                    Register.find({},function(err,docs){
                        console.log(docs);
               res.render('display.jade',{members:docs});
            });


                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
       
    });
    
    app.get('/',function(req,res){
        res.sendFile(__dirname + "/views/index.html");
    });

     
      
    app.listen('3000', function(){
        console.log('running on 3000...');
    });
    