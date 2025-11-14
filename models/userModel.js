const mongoose = require('mongoose');
const bcyrpt = require('bcrypt');

const userSchema = new mongoose.Schema({
name:{
  type:String,
  required:true
},
email:{
  type:String,
  required:true,
  unique:true,
  trim:true,
  lowercase:true,
  match: [/.+\@.+\..+/, "Please enter a valid email address"]
},
password:{
  type:String,
  select:false
},
confirmPassword:{
  type:String,
  //This only work for save and create not for update 
  validate:{
    //This function return tru or false
    validator:function(el){
      return el === this.password
    },
    message:'Confirm Password should be match with password'
  }
},
isAdmin:Boolean,
isActive:Boolean,
passwordChangedAt:{
  type:Date
},
tokenVersion:{
  type:Number,
  default:0
}
  
}, { timestamps: true });

userSchema.methods.comparePassword = async (candidatePassword,userPassword)=>{
  return await bcyrpt.compare(candidatePassword , userPassword);
}

userSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre('save',async function(next){
  if(!this.isModified('password')) next();
  this.password  = await bcyrpt.hash(this.password,10);
  this.confirmPassword = undefined;
  next();
})
module.exports = mongoose.model("User", userSchema);
