class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = {...this.queryString};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el=> delete queryObj[el]);

        // 1B - Advanced Filtering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // This called reqular expression and \b means exact match and g means it would happen multiple times
 
        // We get { difficulty : 'easy', duration :{ gte : '5' } }
        // we we want { difficulty : 'easy', duration :{ $gte : '5' } }
        // The operators are : gte, gt, lte, lt

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy); // sort('first second third -forth')
        }else{
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(){
        if(this.queryString.field){
            const fields = req.query.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }

        return this;
    }


    paginate(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

}

module.exports = APIFeatures;