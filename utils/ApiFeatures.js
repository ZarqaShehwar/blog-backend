class ApiFeatures{
  constructor(query,queryString){
    this.query  = query;
    this.queryString = queryString
  }

filter(){
const queryObj = {...this.queryString};
const excludedFields = ['page','sort','limit','fields'];
  excludedFields.forEach(el=>delete queryObj[el]);

  
 let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);

  this.query.find(JSON.parse(queryStr));
  return this;
}
sort(){
if(this.queryString.sort){
 const sort =  this.queryString.sort(',').join(" ");
 this.query =  this.query.sort(sort)
}
else{
  this.query = this.query.sort("createdAt")
}
 return this;

}
pagination(){
if(this.queryString.page){
 const page =  this.queryString.page.split(',').join(" ");
 const limit = this.queryString.limit || 10,
 skip= (page-1)*limit;
 this.query = this.query.skip(skip).limit(limit)
}
return this ;
}
 limitFields(){
    if(this.queryString.fields){
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    else{
      this.query = this.query.select('-__v');
    }
    return this;
  }
}

module.exports = ApiFeatures;