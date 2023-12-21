class APIFeatures {
  constructor(queryString) {
    this.queryString = queryString;
    this.query = {}
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `[Op.${match}]`);
    this.query.where = JSON.parse(queryStr);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      //const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.order = this.queryString.sort;
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      //const fields = this.queryString.fields.split(',').join(' ');
      this.query.attributes = this.queryString.fields;
    } 

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query.offset = skip;
    this.query.limit = limit;

    return this;
  }
}
module.exports = APIFeatures;